

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
    model="deepseek-reasoner",
    messages=[
        {"role": "system", "content": "You are a front end programmer"},
        {"role": "user", "content": """ // Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    // Đặt trạng thái loading là true khi bắt đầu đăng nhập
    setIsLoading(true);
    try {
      // Gọi API đăng nhập Google từ backend
      const response = await axios.post('/api/auth/google', {
        // Gửi token từ Google OAuth
        token: credential,
      });

      // Kiểm tra response từ server
      if (response.data.success) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Gọi hàm onLogin để cập nhật trạng thái đăng nhập
        onLogin(response.data.user);
      } else {
        throw new Error('Đăng nhập thất bại');
      }
    } catch (error) {
      // Xử lý và log ra lỗi nếu có
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      // Luôn đặt lại trạng thái loading về false khi hoàn thành
      setIsLoading(false); 
    }
  };
         Lỗi đăng nhập: ReferenceError: credential is not defined
    at handleGoogleLogin (Login.jsx:22:16)
    at HTMLUnknownElement.callCallback2 (chunk-NXESFFTV.js?v=ac8cd8d0:3680:22)
    at Object.invokeGuardedCallbackDev (chunk-NXESFFTV.js?v=ac8cd8d0:3705:24)
    at invokeGuardedCallback (chunk-NXESFFTV.js?v=ac8cd8d0:3739:39)
    at invokeGuardedCallbackAndCatchFirstError (chunk-NXESFFTV.js?v=ac8cd8d0:3742:33)
    at executeDispatch (chunk-NXESFFTV.js?v=ac8cd8d0:7046:11)
    at processDispatchQueueItemsInOrder (chunk-NXESFFTV.js?v=ac8cd8d0:7066:15)
    at processDispatchQueue (chunk-NXESFFTV.js?v=ac8cd8d0:7075:13)
    at dispatchEventsForPlugins (chunk-NXESFFTV.js?v=ac8cd8d0:7083:11)
    at chunk-NXESFFTV.js?v=ac8cd8d0:7206:20
         
         tôi đang bị thiếu gì?
"""},
    ],
    stream=False
)

print(response.choices[0].message.content)
# write file
with open("log.txt", "a") as f:
    f.write(f"{response.choices[0].message.content}\n\n")