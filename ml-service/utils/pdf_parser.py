from __future__ import annotations

from pathlib import Path
from typing import Dict, Iterable

import fitz


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def resolve_dataset_dir(dataset_dir: str | Path | None = None) -> Path:
    """Resolve the dataset folder, supporting both dataset/ and Dataset/."""

    candidates: Iterable[Path]
    if dataset_dir is not None:
        candidates = (Path(dataset_dir),)
    else:
        candidates = (
            PROJECT_ROOT / "dataset",
            PROJECT_ROOT / "Dataset",
            PROJECT_ROOT / "data",
        )

    for candidate in candidates:
        if candidate.exists() and candidate.is_dir():
            return candidate

    searched = ", ".join(str(path) for path in candidates)
    raise FileNotFoundError(f"Could not find a dataset directory. Searched: {searched}")


def extract_text_from_pdf(pdf_path: str | Path) -> str:
    """Extract text from a PDF file using PyMuPDF and return the full document text."""

    pdf_file = Path(pdf_path)
    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_file}")

    page_texts: list[str] = []
    with fitz.open(pdf_file) as document:
        for page in document:
            page_text = page.get_text("text") or ""
            page_text = page_text.strip()
            if page_text:
                page_texts.append(page_text)

    return "\n".join(page_texts).strip()


def extract_texts_from_folder(dataset_dir: str | Path | None = None) -> Dict[str, str]:
    """Extract resume text for every PDF in the dataset folder."""

    dataset_path = resolve_dataset_dir(dataset_dir)
    extracted_texts: Dict[str, str] = {}

    for pdf_path in sorted(dataset_path.glob("*.pdf")):
        extracted_texts[pdf_path.name] = extract_text_from_pdf(pdf_path)

    return extracted_texts
