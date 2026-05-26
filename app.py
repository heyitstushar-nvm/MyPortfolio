from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html') 

@app.route('/contact', methods=['POST'])
def contact():
    user_name = request.form.get('name')
    user_email = request.form.get('email')
    user_message = request.form.get('message')
    
    print(f"Message from {user_name} ({user_email}): {user_message}")
    
    return "Thanks for reaching out! I will get back to you soon."

if __name__ == '__main__':
    app.run(debug=True)