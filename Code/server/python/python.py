import xml.etree.ElementTree as ET
import matplotlib.pyplot as plt
import numpy as np
from scipy.spatial import distance
from queue import PriorityQueue

def parse_svg(svg_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    walls = []
    qr_codes = []

    for elem in root.iter():
        if elem.tag.endswith('rect'):
            style = elem.attrib.get('style', '')
            if 'fill:#ff0000' in style:  # red walls
                x = float(elem.attrib['x'])
                y = float(elem.attrib['y'])
                width = float(elem.attrib['width'])
                height = float(elem.attrib['height'])
                walls.append(((x, y), (x + width, y + height)))
            elif 'fill:#000000' in style:  # black QR codes
                x = float(elem.attrib['x'])
                y = float(elem.attrib['y'])
                qr_codes.append((x, y))

    return walls, qr_codes


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
        path += a_star(current, next_code)
        qr_sequence.append(next_code)
        current = next_code
    print(qr_sequence)
    return path, qr_sequence


def save_svg_with_path(svg_path, qr_sequence, output_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()

    path_element = ET.Element("polyline", {
        "points": " ".join(f"{x},{y}" for x, y in qr_sequence),
        "style": "fill:none;stroke:blue;stroke-width:5" 
    })
    root.append(path_element)  

    tree.write(output_path)



svg_file = "floorPlan.svg" 
output_svg = "output_with_path.svg"  

walls, qr_codes = parse_svg(svg_file)
path, qr_sequence = find_shortest_path(qr_codes, walls)
save_svg_with_path(svg_file, qr_sequence, output_svg)

print(f"Path saved to {output_svg}")