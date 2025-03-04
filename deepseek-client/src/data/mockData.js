// Dữ liệu mẫu cho danh sách chat
export const mockChats = [
  {
    id: 1,
    userId: 1,
    title: "Hỏi về React và Next.js",
    timestamp: "2024-03-03T10:00:00Z",
    messages: [
      {
        id: 1,
        userId: 1,
        content: "Tôi muốn tìm hiểu về React và Next.js",
        role: "user",
        timestamp: "2024-03-03T10:00:00Z"
      },
      {
        id: 2,
        content: "React là một thư viện JavaScript phổ biến để xây dựng giao diện người dùng. Next.js là một framework dựa trên React cung cấp nhiều tính năng như Server-Side Rendering, Static Site Generation, và API Routes.",
        role: "assistant",
        timestamp: "2024-03-03T10:01:00Z"
      }
    ]
  },
  {
    id: 2,
    userId: 1,
    title: "Tư vấn về AI và Machine Learning",
    timestamp: "2024-03-02T15:30:00Z",
    messages: [
      {
        id: 3,
        userId: 1,
        content: "Bạn có thể giải thích về AI và Machine Learning không?",
        role: "user",
        timestamp: "2024-03-02T15:30:00Z"
      },
      {
        id: 4,
        content: "AI (Trí tuệ nhân tạo) là một lĩnh vực rộng lớn nghiên cứu về việc tạo ra các hệ thống thông minh. Machine Learning là một nhánh của AI tập trung vào việc phát triển các thuật toán có thể học từ dữ liệu.",
        role: "assistant",
        timestamp: "2024-03-02T15:31:00Z"
      }
    ]
  },
  {
    id: 3,
    userId: 1,
    title: "Hướng dẫn về Tailwind CSS",
    timestamp: "2024-03-01T09:15:00Z",
    messages: [
      {
        id: 5,
        userId: 1,
        content: "Làm thế nào để sử dụng Tailwind CSS hiệu quả?",
        role: "user",
        timestamp: "2024-03-01T09:15:00Z"
      },
      {
        id: 6,
        content: "Tailwind CSS là một framework CSS utility-first giúp bạn xây dựng giao diện nhanh chóng. Bạn có thể sử dụng các class có sẵn để tạo ra các component đẹp mắt mà không cần viết CSS tùy chỉnh.",
        role: "assistant",
        timestamp: "2024-03-01T09:16:00Z"
      }
    ]
  },
  {
    id: 4,
    userId: 1,
    title: "Tư vấn về Web Development",
    timestamp: "2024-02-28T14:20:00Z",
    messages: [
      {
        id: 7,
        userId: 1,
        content: "Con đường trở thành Web Developer chuyên nghiệp?",
        role: "user",
        timestamp: "2024-02-28T14:20:00Z"
      },
      {
        id: 8,
        content: "Để trở thành Web Developer chuyên nghiệp, bạn cần học HTML, CSS, JavaScript, và các framework phổ biến. Đồng thời, việc thực hành thông qua các dự án thực tế là rất quan trọng.",
        role: "assistant",
        timestamp: "2024-02-28T14:21:00Z"
      }
    ]
  },
  {
    id: 5,
    userId: 1,
    title: "Hỏi về Database Design",
    timestamp: "2024-02-27T11:45:00Z",
    messages: [
      {
        id: 9,
        userId: 1,
        content: "Các nguyên tắc cơ bản khi thiết kế database?",
        role: "user",
        timestamp: "2024-02-27T11:45:00Z"
      },
      {
        id: 10,
        content: "Khi thiết kế database, bạn cần tuân thủ các nguyên tắc như chuẩn hóa dữ liệu, xác định khóa chính và khóa ngoại phù hợp, và đảm bảo tính toàn vẹn dữ liệu.",
        role: "assistant",
        timestamp: "2024-02-27T11:46:00Z"
      }
    ]
  }
]; 