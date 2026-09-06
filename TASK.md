# Implement layouts component

- Add folder: `./website/src/components/layouts`
- Base on `flutter` component, implement some layout components

## Rules

- Only `layouts` components

## Tasks 01

1. [x] Row
   Tên: Row
   Công dụng: Sắp xếp các widget con theo hàng ngang
   Các thuộc tính chính: mainAxisAlignment, crossAxisAlignment, mainAxisSize, children, textDirection
   Mục đích sử dụng: Khi cần đặt nhiều widget cạnh nhau theo chiều ngang (VD: icon + text, nhóm nút bấm)
2. [x] Column
   Tên: Column
   Công dụng: Sắp xếp các widget con theo cột dọc
   Các thuộc tính chính: mainAxisAlignment, crossAxisAlignment, mainAxisSize, children
   Mục đích sử dụng: Khi cần xếp chồng các widget theo chiều dọc (VD: form, danh sách thông tin)
3. [x] Stack
   Tên: Stack
   Công dụng: Chồng các widget lên nhau theo trục z
   Các thuộc tính chính: alignment, fit, clipBehavior, children
   Mục đích sử dụng: Khi cần đặt widget đè lên widget khác (VD: badge trên icon, ảnh nền + text)
4. [x] Positioned
   Tên: Positioned
   Công dụng: Định vị chính xác 1 widget bên trong Stack
   Các thuộc tính chính: top, bottom, left, right, width, height
   Mục đích sử dụng: Đặt vị trí tuyệt đối cho widget con trong Stack
5. [x] Container
   Tên: Container
   Công dụng: Widget đa năng để bọc, trang trí, định kích thước widget con
   Các thuộc tính chính: padding, margin, color, decoration, width, height, alignment, constraints
   Mục đích sử dụng: Tạo khối UI có style riêng (nền, viền, bo góc, khoảng cách)
6. [x] Padding
   Tên: Padding
   Công dụng: Thêm khoảng đệm xung quanh widget con
   Các thuộc tính chính: padding (EdgeInsets)
   Mục đích sử dụng: Tạo khoảng cách giữa nội dung và biên widget cha
7. [x] Center
   Tên: Center
   Công dụng: Căn giữa widget con trong không gian cha
   Các thuộc tính chính: widthFactor, heightFactor, child
   Mục đích sử dụng: Căn giữa 1 widget đơn (VD: logo, loading spinner)
8. [x] Align
   Tên: Align
   Công dụng: Căn vị trí widget con theo Alignment tùy chỉnh
   Các thuộc tính chính: alignment, widthFactor, heightFactor
   Mục đích sử dụng: Căn widget con lệch về 1 góc/cạnh cụ thể (không nhất thiết ở giữa)
9. [x] SizedBox
   Tên: SizedBox
   Công dụng: Ép kích thước cố định hoặc tạo khoảng trống
   Các thuộc tính chính: width, height, child
   Mục đích sử dụng: Định kích thước chính xác hoặc làm spacer giữa các widget
10. [x] Expanded
    Tên: Expanded
    Công dụng: Chiếm hết không gian còn lại trong Row/Column
    Các thuộc tính chính: flex, child
    Mục đích sử dụng: Chia đều hoặc theo tỷ lệ không gian giữa các widget con
11. [x] Flexible
    Tên: Flexible
    Công dụng: Cho phép widget con co giãn linh hoạt (không bắt buộc lấp đầy)
    Các thuộc tính chính: flex, fit (loose/tight), child
    Mục đích sử dụng: Linh hoạt hơn Expanded khi không muốn ép chiếm hết không gian
12. [x] Wrap
    Tên: Wrap
    Công dụng: Sắp xếp widget theo hàng/cột, tự động xuống dòng khi tràn
    Các thuộc tính chính: direction, alignment, spacing, runSpacing, children
    Mục đích sử dụng: Hiển thị danh sách tag, chip, hoặc nút bấm co giãn theo màn hình
13. [x] ListView
    Tên: ListView
    Công dụng: Hiển thị danh sách widget có thể cuộn
    Các thuộc tính chính: scrollDirection, itemBuilder, itemCount, physics, padding
    Mục đích sử dụng: Danh sách dài (chat, feed, danh sách sản phẩm)
14. [x] GridView
    Tên: GridView
    Công dụng: Hiển thị dữ liệu dạng lưới (grid) có thể cuộn
    Các thuộc tính chính: gridDelegate, crossAxisCount, mainAxisSpacing, crossAxisSpacing, childAspectRatio
    Mục đích sử dụng: Hiển thị ảnh, sản phẩm dạng lưới nhiều cột
15. [x] AspectRatio
    Tên: AspectRatio
    Công dụng: Ép widget con theo tỷ lệ khung hình nhất định
    Các thuộc tính chính: aspectRatio, child
    Mục đích sử dụng: Giữ tỷ lệ ảnh/video cố định (VD: 16:9)
