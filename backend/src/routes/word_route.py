from flask import Blueprint, request, jsonify, session

from sqlalchemy import func
from src.settings.extensions import db
from src.models.word_model import Word


word_bp = Blueprint("word", __name__, url_prefix="/word")

@word_bp.route("/start", methods=["GET"])
def start_word():
    try:
        word_select = db.session.query(Word).order_by(func.random()).first()
        session["word"] = word_select.word
        
        print(word_select.word)

        return jsonify({"msg": "start game."})
        
    except Exception as e:
        return jsonify({"error": str(e)})
    
    

@word_bp.route("/check", methods=["POST"])
def validar_word():
    try:
        data = request.get_json()
        guess = data["word"].lower()
        target = session.get("word")
        
        if not target:
            return jsonify({"error": "nenhum jogo ativo"}), 400

        if len(guess) != len(target):
            return jsonify({"error": f"palavra deve ter {len(target)} letras"}), 400

        target_list = list(target)
        result = [None] * len(target)
        used = [False] * len(target)

        # 1ª passada: acertos exatos (verde)
        for i in range(len(target)):
            if guess[i] == target_list[i]:
                result[i] = "sucess"
                used[i] = True

        # 2ª passada: letra existe em outra posição (amarelo)
        for i in range(len(target)):
            if result[i] is not None:
                continue
            for j in range(len(target)):
                if guess[i] == target_list[j] and not used[j]:
                    result[i] = "nulo"
                    used[j] = True
                    break

        # 3ª: o que sobrou é rejeitado (cinza)
        for i in range(len(target)):
            if result[i] is None:
                result[i] = "reject"

        status = [
            {"letter": guess[i], "result": result[i]}
            for i in range(len(target))
        ]

        won = all(r == "sucess" for r in result)

        return jsonify({"status": status, "won": won}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
            