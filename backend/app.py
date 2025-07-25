from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import requests
import json

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Hugging Face API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
HF_TOKEN = os.environ.get('HF_TOKEN', '')

def query_huggingface(payload):
    """Query Hugging Face Inference API"""
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@app.route('/')
def serve_frontend():
    """Serve the React frontend"""
    return send_file('static/index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files or fallback to index.html for SPA routing"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Fallback to index.html for SPA routing
        return send_file('static/index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Detailed health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Huggingphaze Backend",
        "version": "1.0.0",
        "huggingface_token_configured": bool(HF_TOKEN),
        "endpoints": [
            "/api/generate",
            "/api/models",
            "/api/health"
        ]
    })

@app.route('/api/generate', methods=['POST'])
def generate_response():
    """Generate AI response from user prompt"""
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'prompt' in request body"
            }), 400
        
        user_prompt = data['prompt']
        
        # For MVP, return a simulated response
        # In production, this would call the Hugging Face API
        if HF_TOKEN:
            # Try to use actual Hugging Face API
            payload = {
                "inputs": user_prompt,
                "parameters": {
                    "max_length": 200,
                    "temperature": 0.7,
                    "do_sample": True
                }
            }
            
            hf_response = query_huggingface(payload)
            
            if "error" not in hf_response and isinstance(hf_response, list) and len(hf_response) > 0:
                ai_response = hf_response[0].get('generated_text', user_prompt)
                # Clean up the response to remove the original prompt
                if ai_response.startswith(user_prompt):
                    ai_response = ai_response[len(user_prompt):].strip()
            else:
                # Fallback to simulated response
                ai_response = f"AI Response: This is a simulated response to your prompt about '{user_prompt}'. In the full implementation with a valid Hugging Face token, this would generate actual AI responses using state-of-the-art language models."
        else:
            # Simulated response for demo purposes
            ai_response = f"AI Response: This is a simulated response to your prompt about '{user_prompt}'. To enable real AI responses, please configure a Hugging Face API token in the environment variables."
        
        return jsonify({
            "status": "success",
            "prompt": user_prompt,
            "response": ai_response,
            "model": "microsoft/DialoGPT-medium" if HF_TOKEN else "simulated"
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }), 500

@app.route('/api/models', methods=['GET'])
def get_available_models():
    """Get list of available AI models"""
    models = [
        {
            "id": "microsoft/DialoGPT-medium",
            "name": "DialoGPT Medium",
            "description": "Conversational AI model for dialogue generation",
            "complexity": "green"
        },
        {
            "id": "facebook/blenderbot-400M-distill",
            "name": "BlenderBot 400M",
            "description": "Open-domain chatbot with personality",
            "complexity": "amber"
        },
        {
            "id": "microsoft/DialoGPT-large",
            "name": "DialoGPT Large",
            "description": "Large-scale conversational AI model",
            "complexity": "red"
        }
    ]
    
    return jsonify({
        "status": "success",
        "models": models
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)

