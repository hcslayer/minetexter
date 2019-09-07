from flask import Flask, render_template, url_for, send_from_directory, request, redirect, jsonify 
from flask_bootstrap import Bootstrap 
from twilio import twiml

app = Flask(__name__)
bootstrap = Bootstrap(app)

# arbitrary starter values 
payload_i = 'null' 
payload_j = 'null'

@app.route('/')
def index(): 
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_script(path): 
    return send_from_directory('static', path)

@app.route('/sms', methods=['POST'])
def sms_response(): 
    payload = request.form.get('Body')
    coords = [int(s) for s in payload.split() if s.isdigit()]
    global payload_i
    global payload_j
    if len(coords) > 1: 
        payload_i, payload_j = (coords[0], coords[1])
    return 'OK'

@app.route('/gettarget')
def p5_response(): 
    return jsonify(target_i=payload_i, target_j=payload_j)


if __name__ == '__main__': 
    app.run(host='0.0.0.0', debug=True, port=5000) # turn off for prod 
    

