# MYSignVoice presentation guide

Use slides 1–20 for the presentation. Slides 21–23 are backup plots for questions.
The suggested speaking time is 13 minutes 48 seconds, plus 5 minutes for the
demonstration. This leaves 1 minute 12 seconds for transitions within 20 minutes.
Open PowerPoint's Notes pane or Presenter View for the slide-specific explanations.

| Presenter | Slides | Content | Suggested time |
| --- | --- | --- | --- |
| Aedan | 1–3 | Introduction, target users and contribution | 1 min 54 sec |
| Hui Min | 4–6 | Frontend, backend and camera speech | 2 min 36 sec |
| Kendrew | 7–11 | Architecture, deep learning, dataset and curves | 4 min 18 sec |
| Crystal | 12–17 | Results, speed, tests, errors, beta evaluation and limitations | 4 min 21 sec |
| Aedan | 18 | Conclusion and handover | 39 sec |
| Hui Min | 19 | School-zone video and class demonstration | 5 min |
| Team | 20 | Questions | After the presentation |

## Demo preparation

The video is separate from the deck. Play the school-zone recording for 1–2 minutes,
then show the class examples for the remaining time. Record the upload results in
advance and edit the class sequence so that every predicted class name is readable.
Use a few speech examples rather than waiting for full speech on every class.

The demo pack contains 48 tested original images and 12 trial four-image frames.
The `successful_four_sign_frames` folder contains four frames that detected all
four expected classes in the preparation check. The other trial frames remain
available for reviewing errors.

Add the remaining 15 class images using `demo/class_coverage.csv`, then check their
predictions before recording a complete 63-class demonstration. Read
`demo/README.md` for the class IDs, server commands and full test summary.

## Results used in the slides

Training and evaluation curves are labelled Version 1. The final model results
and dataset counts come from Version 3. The reviewed 84-image check covers 48
classes and differs from held-out detection metrics. Beta testing appears as a
proposed user evaluation because completed participant results remain unverified.

## Included files

- `MYSignVoice_Final_Presentation.pptx`: editable slides and presenter notes.
- `MYSignVoice_Demo_Pack.zip`: demo images, checklist and recorded API results.
- `diagrams/`: standalone architecture and deep learning workflow images.
