# Tạm thời không dùng
# pip install flask flask-cors mysql-connector-python python-dotenv openai google-auth PyJWT==1.7.1
from openai import OpenAI

def read_api_key(path='API_KEY.txt'):
    
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
        {"role": "user", "content": """
# Thư viện
from gologin import GoLogin
from selenium import webdriver
import logging, threading, time, random, pyotp

from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pandas as pd
import threading
from sys import platform
import pyautogui
import time
from random import randint
import pyotp
from concurrent.futures import ThreadPoolExecutor
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
start_time = time.time()  # Bắt đầu tính thời gian

# Cấu hình logging và lock
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
file_lock = threading.Lock()


def start(token,profile_id,index, position, row,service,retry=3):
    try:
        # Sử dụng port base + index
        base_port = 35000
        gl = GoLogin({
            'token': token,
            'profile_id': profile_id,
            'port': str(base_port + index)
        })
        email = row[0]
        password = row[1]
        key_2fa = row[2]
        debugger_address = gl.start()
        chrome_options = Options()
        chrome_options.add_experimental_option("debuggerAddress", debugger_address)
        driver = webdriver.Chrome(
                service=service, options=chrome_options
            )
        x, y, width, height = position
        driver.set_window_position(x, y)
        driver.set_window_size(width, height)
        # Đăng nhập
        driver.get(
                "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dgg%26oq%3Dgg%26gs_lcrp%3DEgZjaHJvbWUyBggAEEUYOdIBBzM1NGowajeoAgiwAgE%26sourceid%3Dchrome%26ie%3DUTF-8&ec=GAZAAQ&hl=en&ifkv=AeZLP98-cONx1OrDzdjyac3uyod5z4_vXE2O5XFAxjpFlGGZiyN_29bs_ldItd1jHyVB-yxAfuy9SQ&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1881524301%3A1733935131349439&ddm=1"
            )
        time.sleep(randint(15, 30))

        # làm sạch tài khoản
        driver.find_element(
                    By.XPATH,
                    "/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div[1]/form/span/section/div/div/div[1]/div/div[1]/div/div[1]/input",
                ).clear()
        time.sleep(randint(1, 3))
        # Ví dụ: nhập email với retry nếu element không hiện ra
        for attempt in range(retry):
            try:
                email_input = wait_for_element(driver, "//input[@type='email']", timeout=10)
                email_input.clear()
                for char in email:
                    email_input.send_keys(char)
                    time.sleep(random.uniform(0.02, 0.2))
                break
            except Exception as e:
                logging.error(f"Thử {attempt+1} nhập email lỗi: {e}")
                if attempt == retry - 1: raise
        # click từ tài khoản sang mật khẩu
        click_button(
                        driver=driver,
                        XPATH="/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[3]/div/div[1]/div/div/button",
                        code="button_submit_1",
                    )
        # làm sạch mật khẩu
        driver.find_element(
            By.XPATH,
            "/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div/form/span/section[2]/div/div/div[1]/div[1]/div/div/div/div/div[1]/div/div[1]/input",
        ).clear()

        time.sleep(randint(1, 3))

        # input_send_key(
        #     driver=driver,
        #     code="input_mk_1",
        #     XPATH="/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div/form/span/section[2]/div/div/div[1]/div[1]/div/div/div/div/div[1]/div/div[1]/input",
        #     text=password,
        # )
        # Ví dụ: nhập password với retry nếu element không hiện ra
        for attempt in range(retry):
            try:
                password_input = wait_for_element(driver, "//input[@type='password']", timeout=10)
                password_input.clear()
                for char in password:
                    password_input.send_keys(char)
                    time.sleep(random.uniform(0.02, 0.2))
                break
            except Exception as e:
                logging.error(f"Thử {attempt+1} nhập email lỗi: {e}")
                if attempt == retry - 1: raise
        # Click từ mật khẩu qua 2fa
        click_button(
                    driver=driver,
                    XPATH="/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[3]/div/div[1]/div/div/button",
                    code="button_submit_1",
                )
        
        # Click Google Authenticator
        try:
            # Chờ element xuất hiện và click được
            authenticator_li = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//li[.//div[contains(@class,'l5PPKe') and contains(., 'Google Authenticator')]]"))
            )
            
            # Click vào element
            authenticator_li.click()
            time.sleep(randint(15, 30))
        except Exception as e:
            print(e)
        
        

        # Làm sạch key 2fa
        driver.find_element(
            By.XPATH,
            "/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div/form/span/section[3]/div/div/div[1]/div/div[1]/div/div[1]/input",
        ).clear()

        time.sleep(randint(1, 3))
        # Điền key 2fa
        # input_send_key(
        #     driver=driver,
        #     code="input_mk_1",
        #     XPATH="/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div/form/span/section[3]/div/div/div[1]/div/div[1]/div/div[1]/input",
        #     text=pyotp.TOTP(key_2fa).now(),
        # )
        # Ví dụ: nhập password với retry nếu element không hiện ra
        for attempt in range(retry):
            try:
                key_2_fa = wait_for_element(driver, "/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[2]/div/div/div/form/span/section[3]/div/div/div[1]/div/div[1]/div/div[1]/input", timeout=10)
                key_2_fa.clear()
                for char in pyotp.TOTP(key_2fa).now():
                    key_2_fa.send_keys(char)
                    time.sleep(random.uniform(0.02, 0.2))
                break
            except Exception as e:
                logging.error(f"Thử {attempt+1} nhập email lỗi: {e}")
                if attempt == retry - 1: raise
        # Click key 2 fa vô login thành công
        click_button(
                    driver=driver,
                    XPATH="/html/body/div[1]/div[1]/div[2]/c-wiz/div/div[3]/div/div[1]/div/div/button",
                    code="button_submit_3",
                )
        
        driver.get(
                "https://play.google.com/store/pass/getstarted?hl=un_US&gl=us"
                )
        WebDriverWait(driver, 15).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@role='listitem']")))
        # Chờ các phần tử game được load
        wait = WebDriverWait(driver, 10)
        game_items = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[@role='listitem']")))

        # Duyệt qua từng game
        for item in game_items:
            try:
                # Lấy tiêu đề game
                title = item.find_element(By.XPATH, ".//span[contains(@class, 'fkdIre') and contains(@class, 'iEDKhd')]").text
                
                if title == "Call of Duty: Mobile Season 2":
                    # Lấy tiêu đề khuyến mãi
                    promo = item.find_element(By.XPATH, ".//div[contains(@class, 'YLCN0d') and contains(@class, 'iEDKhd')]").text
                    safe_file_write("game.txt", f'{index}-{email}-{password}-{key_2fa}-Call of Duty: Mobile Season 2-{promo}\n')
                    return
            except:
                continue
        safe_file_write("success.txt", f'{index}-{email}-{password}-{key_2fa}-Thành công\n')

    except Exception as e:
        logging.error(f"Lỗi với mail {row[0]}: {e}")
        safe_file_write("error.txt", f'{index}-{email}-{password}-{key_2fa}-{e}\n')
    finally:
        try:
            driver.close()
            driver.quit()  # Đóng driver sạch sẽ
        except:
            pass
        time.sleep(random.randint(3, 5))
def read_profile_ids(file_path="CONFIG/gologin_profile_ids.txt"):
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()  # Đọc tất cả các dòng vào một list
        # Loại bỏ ký tự xuống dòng ('\n') khỏi mỗi dòng
        lines = [line.strip() for line in lines]
        return lines
    except FileNotFoundError:
        return f"Lỗi: Không tìm thấy tệp '{file_path}'"
    except Exception as e:
        return f"Lỗi: Đã xảy ra lỗi khi đọc tệp: {e}"
def read_token_gologin(file_path='CONFIG/token_gologin.txt'):
  try:
    with open(file_path, 'r') as f:
      content = f.read()
    return content
  except FileNotFoundError:
    return f"Lỗi: Không tìm thấy tệp '{file_path}'"
  except Exception as e:
    return f"Lỗi: Đã xảy ra lỗi khi đọc tệp: {e}"
def read_input_csv(path="CONFIG/input.csv"):
    df = pd.read_csv(
        path,
        sep="|",
        header=None,
    )

    return df
def get_service_chromedrive(file_path="chromedriver.exe"):
    if platform == "linux" or platform == "linux2":
        chrome_driver_path = "./chromedriver"
        print("Máy Linux đang hoạt động")
        return chrome_driver_path
    elif platform == "darwin":
        # chrome_driver_path = './mac/chromedriver'
        service = Service(
            executable_path="/Users/Shared/DATA/AutoLoginGoogle/test/chromedriver-mac-arm641/chromedriver"
        )
        print("Máy mac đang hoạt động")
        return service
    elif platform == "win32":

        service = Service(executable_path=file_path)

        print("Máy Windows đang hoạt động")
        return service
def get_screen_grid(num_windows=10):
    
    screen_width, screen_height = pyautogui.size()
    cols = int(num_windows**0.5)  # Số cột trong lưới (hàng = cột)
    try:
        rows = -(-num_windows // cols)  # Làm tròn lên số hàng
    except ZeroDivisionError:
        return False

    cell_width = screen_width // cols
    cell_height = screen_height // rows

    positions = []
    for row in range(rows):
        for col in range(cols):
            if len(positions) < num_windows:
                x = col * cell_width
                y = row * cell_height
                positions.append((x, y, cell_width, cell_height))

    return positions
def get_list_min(lists=[]):
    # Giả định phần tử đầu tiên là danh sách nhỏ nhất
    list_min = lists[0]
    for lst in lists:
        if len(lst) < len(list_min):  # So sánh từng danh sách
            list_min = lst

    return list_min
def input_send_key(driver, XPATH, text, code):
    try:
        element = driver.find_element(By.XPATH, XPATH)
        # Gõ từng ký tự một
        for char in text:
            element.send_keys(char)
            # Tạo một khoảng dừng ngắn giữa các ký tự (tùy chọn)
            time_sleep_random = randint(1, 10) / 50
            time.sleep(time_sleep_random)
        time.sleep(randint(3, 5))
        return True
    except Exception as e:
        print(f"Đã xảy ra lỗi khi gửi text: {e} - {code}")
        return False
def click_button(driver, XPATH, code, sleepS=15, sleepE=30):
    try:
        element = driver.find_element(By.XPATH, XPATH)
        element.click()
        time.sleep(randint(sleepS, sleepE))
        return True
    except Exception as e:
        print(f"Đã xảy ra lỗii khi click vào nút: {e} - {code}")
        return False
def get_port(index):
    if index < 10:
        return f"666{index}"
    if index < 100:
        return f"66{index}"
    raise ValueError("Index quá lớn, không thể tạo port 4 chữ số.")
def wait_for_element(driver, xpath, timeout=60):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.XPATH, xpath)))
def safe_file_write(filename, text):
    with file_lock:
        with open(filename, 'a', encoding='utf-8') as f:
            f.write(text + "\n")
profile_ids = read_profile_ids()
token_gologin = read_token_gologin()
df = read_input_csv()



    

# threads= []
# for index,row in df.iterrows():
#     t = threading.Thread(target=start, args=(
#         token_gologin,
#         profile_ids[index % len(profile_ids)],
#         index, 
#         positions[index % len(positions)],
#         row
#         ))
#     threads.append(t)
#     if index == 6:
#         break
    
# for t in threads:
#     t.start()
#     time.sleep(0.2)


# Sử dụng ThreadPoolExecutor với số thread cấu hình (vd: tối đa 4 thread)
MAX_WORKERS = min(10, len(profile_ids), len(df))
positions = get_screen_grid(num_windows=MAX_WORKERS)


with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    for index, row in df.iterrows():
        service = get_service_chromedrive()
        executor.submit(start, token_gologin, profile_ids[index % len(profile_ids)], index, 
                        positions[index % len(positions)], row, service)

    
elapsed_time = time.time() - start_time  # Tính thời gian đã trôi qua
print(f"Thời gian chạy: {elapsed_time:.2f} giây")

         Tôi muốn sau 1 khoảng thời gian hoặc lượt chạy nhất đinh, chạy đường dẫn này "http://192.168.50.249:10101/api/proxy?t=2&num=30&today&Port=60000"
         đường dẫn này giúp thay đổi proxy trong máy tính của tôi. Làm cách nào để tính toán chạy đường dẫn khi các luồng không hoạt động, để không ảnh hưởng đến các luồng 
"""
},
    ],
    stream=False
)

result = response.choices[0].message.content
print(result)
# Write the result into readme.md
with open("readme.md", "w", encoding="utf-8") as f:
    f.write(result)


# # Thêm decorator xác thực token
# from functools import wraps

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#         # Lấy token từ header Authorization
#         if 'Authorization' in request.headers:
#             auth_header = request.headers['Authorization']
#             token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else None

#         if not token:
#             return jsonify({
#                 'success': False,
#                 'message': 'Token không tồn tại!'
#             }), 401

#         try:
#             # Giải mã token
#             data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
#             current_user_id = data['user_id']
#         except jwt.ExpiredSignatureError:
#             return jsonify({
#                 'success': False,
#                 'message': 'Token đã hết hạn!'
#             }), 401
#         except jwt.InvalidTokenError:
#             return jsonify({
#                 'success': False,
#                 'message': 'Token không hợp lệ!'
#             }), 401
#         except Exception as e:
#             print(e)
#             return jsonify({
#                 'success': False,
#                 'message': 'Lỗi xác thực token'
#             }), 401

#         return f(current_user_id, *args, **kwargs)

#     return decorated

# # API lấy danh sách phiên chat
# @app.route('/chat-sessions', methods=['GET'])
# @token_required
# def get_chat_sessions(current_user_id):
#     '''
#     Lấy tất cả phiên chat của user đang đăng nhập
#     '''
#     conn = get_db_connection()
#     if not conn:
#         return jsonify({
#             'success': False,
#             'message': 'Lỗi kết nối database'
#         }), 500

#     try:
#         cursor = conn.cursor(dictionary=True)

#         # Truy vấn tất cả phiên chat của user
#         cursor.execute('''
#             SELECT
#                 id,
#                 title,
#                 created_at,
#                 updated_at
#             FROM sessions_chat
#             WHERE user_id = %s
#             ORDER BY created_at DESC
#         ''', (current_user_id,))

#         sessions = cursor.fetchall()

#         # Format lại định dạng thời gian
#         for session in sessions:
#             session['created_at'] = session['created_at'].isoformat()
#             session['updated_at'] = session['updated_at'].isoformat()

#         return jsonify({
#             'success': True,
#             'message': 'Lấy danh sách phiên chat thành công',
#             'sessions': sessions
#         }), 200

#     except mysql.connector.Error as err:
#         print("Lỗi database:", err)
#         return jsonify({
#             'success': False,
#             'message': 'Lỗi truy vấn database'
#         }), 500
#     except Exception as e:
#         print("Lỗi:", e)
#         return jsonify({
#             'success': False,
#             'message': 'Lỗi server'
#         }), 500
#     finally:
#         if conn.is_connected():
#             cursor.close()
#             conn.close()