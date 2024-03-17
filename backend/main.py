from flask import Flask, render_template, request, send_file
from rembg import remove
from PIL import Image
from io import BytesIO


app = Flask(__name__)


@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    
    file_contents = Image.open(file.stream)
    
    output = remove(file_contents, post_process_mask=True)
    imgIo = BytesIO()
    output.save(imgIo, 'PNG')
    imgIo.seek(0)
        
    return send_file(imgIo, mimetype=file.mimetype, download_name='_remove_image.png')

if __name__ == '__main__':
    app.run(debug=True)