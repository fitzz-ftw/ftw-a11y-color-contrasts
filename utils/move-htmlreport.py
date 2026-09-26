#!/usr/bin/env python3.14 
"""
    Verschiebt das von vitest erstellte HTML-Verzeichnis nach
    'docs/' wenn es existiert.
"""
from pathlib import Path
from shutil import rmtree, move

dest_dir=Path("docs/html")
src_dir =Path("html")

if (src_dir.is_dir()):
    if not dest_dir.parent.is_dir():
        dest_dir.parent.mkdir(parents=True, exist_ok=True)
    else:
        if(dest_dir.is_dir()):
            rmtree(dest_dir)
    move(src_dir, dest_dir.parent)
