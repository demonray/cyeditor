/**
 * Created by DemonRay on 2019/3/22.
 */
const edgeStyle = [{
    "selector": "node",
    "style": {
        "text-valign": "center",
        "text-halign": "left"
    }
}, {
    "selector": "node[?flipLabel]",
    "style": {
        "text-halign": "right"
    }
}, {
    "selector": "node[type]",
    "style": {
        "label": "data(type)"
    }
}, {
    "selector": "edge",
    "style": {
        "width": 3
    }
}, {
    "selector": "edge.bezier",
    "style": {
        "curve-style": "bezier",
        "control-point-step-size": 40
    }
}, {
    "selector": "edge.unbundled-bezier",
    "style": {
        "curve-style": "unbundled-bezier",
        "control-point-distances": 120,
        "control-point-weights": 0.1
    }
}, {
    "selector": "edge.multi-unbundled-bezier",
    "style": {
        "curve-style": "unbundled-bezier",
        "control-point-distances": [40, -40],
        "control-point-weights": [0.250, 0.75]
    }
}, {
    "selector": "edge.haystack",
    "style": {
        "curve-style": "haystack",
        "haystack-radius": 0.5
    }
}, {
    "selector": "edge.segments",
    "style": {
        "curve-style": "segments",
        "segment-distances": [ 40, -40 ],
        "segment-weights": [0.250 , 0.75]
    }
}, {
    "selector": "edge.taxi",
    "style": {
        "curve-style": "taxi",
        "taxi-direction": "downward",
        "taxi-turn": 20,
        "taxi-turn-min-distance": 5
    }
}]

const edge = [{
    "data": {
        "id": "n01",
        "type": "bezier"
    }
}, {
    "data": {
        "id": "n02"
    }
}, {
    "data": {
        "source": "n01",
        "target": "n02"
    },
    "classes": "bezier"
}, {
    "data": {
        "source": "n01",
        "target": "n02"
    },
    "classes": "bezier"
}, {
    "data": {
        "source": "n02",
        "target": "n01"
    },
    "classes": "bezier"
}, {
    "data": {
        "id": "n03"
    }
}, {
    "data": {
        "id": "n04",
        "type": "unbundled-bezier",
        "flipLabel": true
    }
}, {
    "data": {
        "source": "n03",
        "target": "n04"
    },
    "classes": "unbundled-bezier"
}, {
    "data": {
        "id": "n05",
        "type": "unbundled-bezier(multiple)"
    }
}, {
    "data": {
        "id": "n06"
    }
}, {
    "data": {
        "source": "n05",
        "target": "n06"
    },
    "classes": "multi-unbundled-bezier"
}, {
    "data": {
        "id": "n14"
    }
}, {
    "data": {
        "id": "n15",
        "type": "straight",
        "flipLabel": true
    }
}, {
    "data": {
        "source": "n14",
        "target": "n15"
    },
    "classes": "straight"
}, {
    "data": {
        "id": "n07",
        "type": "haystack"
    }
}, {
    "data": {
        "id": "n08"
    }
}, {
    "data": {
        "id": "e06",
        "source": "n08",
        "target": "n07"
    },
    "classes": "haystack"
}, {
    "data": {
        "source": "n08",
        "target": "n07"
    },
    "classes": "haystack"
}, {
    "data": {
        "source": "n08",
        "target": "n07"
    },
    "classes": "haystack"
}, {
    "data": {
        "source": "n08",
        "target": "n07"
    },
    "classes": "haystack"
}, {
    "data": {
        "id": "n09"
    }
}, {
    "data": {
        "id": "n10",
        "type": "segments",
        "flipLabel": true
    }
}, {
    "data": {
        "source": "n09",
        "target": "n10"
    },
    "classes": "segments"
}, {
    "data": {
        "id": "n11"
    }
}, {
    "data": {
        "id": "n12"
    }
}, {
    "data": {
        "id": "n13",
        "type": "taxi"
    }
}, {
    "data": {
        "source": "n13",
        "target": "n11"
    },
    "classes": "taxi"
}, {
    "data": {
        "source": "n13",
        "target": "n12"
    },
    "classes": "taxi"
}, {
    "data": {
        "id": "n16",
        "type": "loop",
        "flipLabel": true
    }
}, {
    "data": {
        "source": "n16",
        "target": "n16"
    },
    "classes": "loop"
}]
