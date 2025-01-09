import xml.etree.ElementTree as ET
from flask import Flask, request, jsonify
from scipy.spatial import distance
from queue import PriorityQueue


# Parse the SVG to extract walls
def parse_svg(svg_content):
    root = ET.fromstring(svg_content)
    walls = []

    for elem in root.iter():
        if elem.tag.endswith('rect'):
            style = elem.attrib.get('style', '')
            if 'fill:#ff0000' in style:  # red walls
                x = float(elem.attrib['x'])
                y = float(elem.attrib['y'])
                width = float(elem.attrib['width'])
                height = float(elem.attrib['height'])
                walls.append(((x, y), (x + width, y + height)))

    return walls


# A* pathfinding
def find_shortest_path(qr_codes, walls):
    def is_collision(point, walls):
        for wall in walls:
            (x1, y1), (x2, y2) = wall
            if x1 <= point[0] <= x2 and y1 <= point[1] <= y2:
                return True
        return False

    def neighbors(node):
        moves = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        result = []
        for dx, dy in moves:
            neighbor = (node[0] + dx, node[1] + dy)
            if not is_collision(neighbor, walls):
                result.append(neighbor)
        return result

    def a_star(start, goal):
        open_set = PriorityQueue()
        open_set.put((0, start))
        came_from = {}
        g_score = {start: 0}
        f_score = {start: distance.euclidean(start, goal)}

        while not open_set.empty():
            _, current = open_set.get()
            if current == goal:
                path = []
                while current in came_from:
                    path.append(current)
                    current = came_from[current]
                path.reverse()
                return path

            for neighbor in neighbors(current):
                tentative_g_score = g_score[current] + distance.euclidean(current, neighbor)
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + distance.euclidean(neighbor, goal)
                    open_set.put((f_score[neighbor], neighbor))
        return []

    path = []
    qr_sequence = [qr_codes[0]]
    current = qr_codes[0]
    for next_code in qr_codes[1:]:
        segment = a_star(current, next_code)
        if segment:
            path += segment
            qr_sequence.append(next_code)
            current = next_code
    return path, qr_sequence


# Flask app
app = Flask(__name__)


@app.route('/find-path', methods=['POST'])
def find_path():
    data = request.get_json()
    svg_content = data['eventSVG']
    qr_codes_raw = data['qrCodeDataString']

    # Parse QR codes and walls
    qr_codes = [
        tuple(map(float, qr_code.split(','))[1:]) for qr_code in qr_codes_raw
    ]
    walls = parse_svg(svg_content)

    # Calculate the shortest path
    path, qr_sequence = find_shortest_path(qr_codes, walls)

    return jsonify({'qr_sequence': qr_sequence, 'path': path})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)