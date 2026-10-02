with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id="dashboardContainer"' in l:
        print(f"dashboardContainer start: line {i+1}")
    if 'id="modal-create-goal"' in l:
        print(f"modal-create-goal: line {i+1}")
    if 'initDualModeCosmicStudio' in l:
        print(f"initDualModeCosmicStudio (3D engine): line {i+1}")
    if '<script type="module">' in l:
        print(f"module script start: line {i+1}")
