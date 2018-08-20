import os
import re

import tkinter.filedialog as tk
path = tk.askdirectory(
    initialdir='C:/Users/spri85/Videos/4K Video Downloader',
    title='Select folder to lessons'
)
os.chdir(path)
# path = os.getcwd()
print(path)

filenames = os.listdir(path)
print(filenames)
pattern = re.compile(r"(?P<lesson_number>[\d]+)(?P<extention>\.mp4)", re.I)


def count_lessons(filenames, pattern):
    total_lessons = 0
    for lesson in filenames:
        if pattern.search(lesson):
            total_lessons += 1
    return total_lessons


def rename(filenames, pattern):
    total_lessons = count_lessons(filenames, pattern)

    for filename in filenames:
        result = pattern.search(filename)

        if result:
            prefix_count = '0'*(len(str(total_lessons)) -
                                len(result.group('lesson_number')))
            new_name = (prefix_count+result.group('lesson_number') +
                        result.group('extention'))
            try:
                os.rename(filename, new_name)
            except FileExistsError:
                print(f'You already have a file with name: {new_name}')


rename(filenames, pattern)
