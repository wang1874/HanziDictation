#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从txt文件中提取所有汉字
"""

import re

def extract_all_chars(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    all_chars = set()
    
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('《') and '》' in line:
            title_match = re.match(r'^《(.*?)》：(.*)$', line)
            if title_match:
                chars_str = title_match.group(2).strip()
                if chars_str != '无':
                    chars = chars_str.split('、')
                    for char in chars:
                        if char:
                            all_chars.add(char)
    
    return sorted(list(all_chars))

def main():
    file_path = 'deepseek_txt_20260513_2bb2cc.txt'
    all_chars = extract_all_chars(file_path)
    
    print(f'共找到 {len(all_chars)} 个汉字：')
    print('、'.join(all_chars))
    
    print('\n\n请为这些汉字提供拼音，格式：汉字:pinyin')

if __name__ == '__main__':
    main()
