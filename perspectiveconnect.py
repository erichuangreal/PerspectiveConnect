import gradio as gr
import speech_recognition as sr
from openai import OpenAI
from gtts import gTTS
import random
import string
import time
import os

#input_messages = [{"role": "system", "content": 'You are a knowledgeable and helpful intelligent chat robot. Your task is to chat with me. Please use a short conversational style and speak in Chinese. Each answer should not exceed 50 words!'}]
input_messages = [{"role": "system", "content": 'Please criticize the content and delivery my presentation and give constructive feedback for improvement!'}]


client = OpenAI(api_key='sk-aichoicesservice-OFNmT1NXrWnmZB3262bYT3BlbkFJv3hIZDbp4I1M6yAfocNq') 
transcription = "";

def generate_ai_response_file_path(length=10):
    # Get the current timestamp
    timestamp = time.time()
    
    # Seed the random number generator with the timestamp
    random.seed(timestamp)
    
    # Define the character set for the random string
    characters = string.ascii_letters + string.digits
    
    # Generate the random string
    ai_response_file_path = ''.join(random.choice(characters) for _ in range(length))
    
    return ai_response_file_path

# Function to transcribe audio with a retry mechanism
def transcribe_audio(audio_path, retries=5, delay=2):
    print("Transcribe audio... time: ", time.time())
    global transcription
    recognizer = sr.Recognizer()
    for attempt in range(retries):
        if audio_path is not None and os.path.exists(audio_path):
            try:
                with sr.AudioFile(audio_path) as source:
                    audio_data = recognizer.record(source)
                    transcription += " " + recognizer.recognize_google(audio_data)
                    return transcription
            except sr.UnknownValueError:
                print("Audio not clear enough to transcribe.")
                return transcription
        else:
            print(f"Attempt {attempt + 1}/{retries}: Audio file not available, retrying in {delay} seconds...")
            time.sleep(delay)
    return "Audio file not available after multiple attempts."

def get_feedback(transcription):
    global input_messages

    input_messages.append({"role": "user", "content": transcription})

    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=input_messages,
        stream=True,
    )
    response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            response += " " + chunk.choices[0].delta.content
    return response

def text_to_speech(response):
    tts = gTTS(text=response, lang='en')
    audio_path = generate_ai_response_file_path() + ".mp3"
    tts.save(audio_path)
    return audio_path

def process_presentation(audio):
    # Step 1: Transcribe audio
    transcription = transcribe_audio(audio)
    
    # Step 2: Get feedback from GPT-3.5
    feedback = get_feedback(transcription)
    
    # Step 3: Convert feedback to speech
    audio_feedback_path = text_to_speech(feedback)
    
    return transcription, feedback, audio_feedback_path

def submit_callback():
    global transcription
    print("Processing presentation...")
    # Step 1: Get feedback from GPT-3.5
    feedback = get_feedback(transcription)
    
    # Step 2: Convert feedback to speech
    audio_feedback_path = text_to_speech(feedback)
    transcription = ""
    return feedback, audio_feedback_path

with gr.Blocks() as ui:
    with gr.Row():
        gr.Markdown("# AI Presentation Trainer")
        gr.Markdown("Practice your presentation to get transcription, feedback, and audio feedback.")
    
    audio_input = gr.Audio(sources=["microphone"], type="filepath", streaming=True, every=10, label="Record your presentation")
    submit_button = gr.Button("Submit")

    presentation_text = gr.Textbox(label="Presentation")
    ai_response = gr.Textbox(label="AI Response")
    audio_ai_response = gr.Audio(label="Audio AI Response", type="filepath")

    audio_input.change(transcribe_audio, inputs=audio_input, outputs=[presentation_text])
    submit_button.click(submit_callback, outputs=[ai_response, audio_ai_response])

#ui.launch(auth=(server_name="0.0.0.0", server_port=7860, "test", "eric123321!"), share=True)
ui.launch(share=True, server_name="0.0.0.0", server_port=7860)
