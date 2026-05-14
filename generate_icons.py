#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成新设计的PNG图标
"""

from PIL import Image, ImageDraw, ImageFont

def create_icon(size=1024):
    """创建新设计的图标"""
    # 创建透明背景的图片
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 米黄色渐变背景（使用两个矩形模拟渐变）
    bg_color1 = (255, 248, 231)  # 浅米黄
    bg_color2 = (255, 228, 196)  # 深米黄
    
    # 绘制圆角矩形背景
    corner_radius = size // 5
    draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=bg_color1)
    
    # 绘制渐变效果
    for i in range(size):
        ratio = i / size
        r = int(bg_color1[0] * (1 - ratio) + bg_color2[0] * ratio)
        g = int(bg_color1[1] * (1 - ratio) + bg_color2[1] * ratio)
        b = int(bg_color1[2] * (1 - ratio) + bg_color2[2] * ratio)
        draw.line([(0, i), (size, i)], fill=(r, g, b))
    
    # 田字格外框大小
    inner_size = int(size * 0.6)
    inner_x = (size - inner_size) // 2
    inner_y = (size - inner_size) // 2
    
    # 绘制田字格外框（红色边框）
    frame_color = (139, 0, 0)  # 深红色
    frame_thickness = size // 80
    
    # 外框圆角矩形
    draw.rounded_rectangle(
        [inner_x, inner_y, inner_x + inner_size, inner_y + inner_size],
        radius=12,
        outline=frame_color,
        width=frame_thickness
    )
    
    # 绘制田字格十字线
    center_x = inner_x + inner_size // 2
    center_y = inner_y + inner_size // 2
    
    # 横线
    draw.line(
        [(inner_x, center_y), (inner_x + inner_size, center_y)],
        fill=frame_color,
        width=frame_thickness // 2
    )
    
    # 竖线
    draw.line(
        [(center_x, inner_y), (center_x, inner_y + inner_size)],
        fill=frame_color,
        width=frame_thickness // 2
    )
    
    # 添加文字（听写）
    try:
        # 尝试使用中文字体
        font_path = '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc'
        font = ImageFont.truetype(font_path, int(size * 0.18))
    except:
        # 如果找不到字体，使用默认字体
        font = ImageFont.load_default()
        print("警告：使用默认字体，可能无法正确显示中文")
    
    text_color = (61, 26, 0)  # 深棕色文字
    
    # 绘制"听"字（上半部分）
    text1 = "听"
    text1_bbox = draw.textbbox((0, 0), text1, font=font)
    text1_width = text1_bbox[2] - text1_bbox[0]
    text1_height = text1_bbox[3] - text1_bbox[1]
    text1_x = center_x - text1_width // 2
    text1_y = inner_y + (inner_size // 2 - text1_height) // 2
    draw.text((text1_x, text1_y), text1, fill=text_color, font=font)
    
    # 绘制"写"字（下半部分）
    text2 = "写"
    text2_bbox = draw.textbbox((0, 0), text2, font=font)
    text2_width = text2_bbox[2] - text2_bbox[0]
    text2_height = text2_bbox[3] - text2_bbox[1]
    text2_x = center_x - text2_width // 2
    text2_y = center_y + (inner_size // 2 - text2_height) // 2
    draw.text((text2_x, text2_y), text2, fill=text_color, font=font)
    
    return img

def main():
    # 生成主图标 (1024x1024)
    print("生成主图标 icon.png...")
    icon = create_icon(1024)
    icon.save('assets/icon.png', 'PNG')
    
    # 生成启动画面图标 (1024x1024)
    print("生成启动画面图标 splash-icon.png...")
    splash = create_icon(1024)
    splash.save('assets/splash-icon.png', 'PNG')
    
    # 生成自适应图标前景 (1080x1080)
    print("生成自适应图标 adaptive-icon.png...")
    adaptive = create_icon(1080)
    adaptive.save('assets/adaptive-icon.png', 'PNG')
    
    # 生成favicon (512x512)
    print("生成favicon.png...")
    favicon = create_icon(512)
    favicon.save('assets/favicon.png', 'PNG')
    
    print("✅ 所有图标已生成完成！")

if __name__ == '__main__':
    main()
