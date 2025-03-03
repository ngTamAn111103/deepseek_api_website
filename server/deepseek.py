

from openai import OpenAI

def read_api_key(path='API_KEY.txt'):
    """
    Reads the API key from a file.

    Args:
        path: The path to the file containing the API key.

    Returns:
        The API key as a string, or None if the file does not exist or is empty.
    """
    try:
        with open(path, 'r') as f:
            api_key = f.read().strip()
            if not api_key:
                print(f"Warning: API key file '{path}' is empty.")
                return None
            return api_key
    except FileNotFoundError:
        print(f"Error: API key file not found at '{path}'.")
        return None
    


client = OpenAI(api_key=read_api_key(), base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a front end programmer"},
        {"role": "user", "content": """ 
Viết cho tôi 1 đoạn văn dài khoảng 1000 từ, nói về câu chuyện của sự cảm thông, có nhân vật và có câu chuyện
"""},
    ],
    stream=False
)

print(response.choices[0].message.content)
