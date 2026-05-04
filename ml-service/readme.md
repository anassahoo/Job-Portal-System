## ML Service Overview

This folder contains a modular machine learning pipeline for analyzing job applications from resume PDFs.

The pipeline is:

1. PDF resume
2. Text extraction with PyMuPDF
3. Text preprocessing
4. Feature engineering
5. RandomForest model training
6. Decision and reason prediction

The model uses three features:

- `match_percentage`
- `resume_score`
- `project_score`

## Project Structure

- `utils/pdf_parser.py` extracts text from PDFs.
- `utils/feature_engineering.py` cleans text and computes feature scores.
- `train_model.py` trains the decision and reason models.
- `predict.py` runs inference from a PDF or from precomputed scores.
- `model/decision_model.pkl` stores the trained decision model bundle.
- `model/reason_model.pkl` stores the trained reason model bundle.

## Training

Run:

```bash
python train_model.py
```

By default the script looks for resume PDFs in `dataset/`, `Dataset/`, or `data/`.

If a `labels.csv` file is available, it should include:

- a filename column such as `filename` or `resume_filename`
- `decision`
- `reason`

If no `labels.csv` file exists, the script creates stable pseudo-labels from the computed scores so the pipeline still trains end to end.

## Inference

Use:

```python
from predict import predict_from_pdf

result = predict_from_pdf(
		"Dataset/your_resume.pdf",
		"We are hiring a Python AI engineer with machine learning, FastAPI, and project experience."
)
```

The returned structure is:

```json
{
	"decision": "Accepted",
	"reason": null,
	"scores": {
		"match_percentage": 0.0,
		"resume_score": 0.0,
		"project_score": 0.0
	}
}
```

## API

The FastAPI app in `app/main.py` keeps the score-based `POST /predict` endpoint for compatibility and also exposes `POST /predict-pdf` for PDF-based analysis.

## Notes

- Install the dependencies in `requirement.txt` before training or running the API.
- This pipeline is modular and production-oriented, but the current dataset still determines model quality.
