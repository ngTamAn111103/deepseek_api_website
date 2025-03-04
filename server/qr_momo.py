import qrcode
from urllib.parse import quote

def create_momo_qr(phone, amount, output_file="momo_qr.png"):
    """
    Tạo mã QR MoMo với số điện thoại và số tiền được nhập sẵn
    - phone: Số điện thoại (ví dụ: '0987654321')
    - amount: Số tiền (đơn vị VNĐ, ví dụ: 100000)
    - output_file: Tên file đầu ra
    """
    # Kiểm tra đầu vào
    if not phone.isdigit() or len(phone) != 10:
        raise ValueError("Số điện thoại không hợp lệ")
    if amount <= 0:
        raise ValueError("Số tiền phải lớn hơn 0")

    # Tạo URL theo chuẩn MoMo
    url_template = "momo://transfer?phone={phone}&amount={amount}&comment=QR_Payment"
    formatted_url = url_template.format(
        phone=phone,
        amount=int(amount)
    )

    # URL encode và thêm prefix
    encoded_url = f"https://qr.momo.vn/{quote(formatted_url)}"
    
    # Tạo QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    qr.add_data(encoded_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_file)
    print(f"Mã QR đã được lưu tại: {output_file}")

# Ví dụ sử dụng
create_momo_qr(
    phone="0987654321",  # Thay bằng số điện thoại thực
    amount=100000,       # Thay bằng số tiền mong muốn
    output_file="momo_payment.png"
)