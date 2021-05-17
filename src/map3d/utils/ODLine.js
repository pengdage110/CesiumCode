export default {
    loadLinesData(viewer) {
        let url = 'static/data/lines-bus.json';
        Cesium.Resource.fetchJson(url).then((data) => {
            let busLines = [];
            data.map(function (busLine, idx) {
                let prevPt;
                let points = [];
                for (let i = 0; i < busLine.length; i += 2) {
                    let pt = [busLine[i], busLine[i + 1]];
                    if (i > 0) {
                        pt = [
                            prevPt[0] + pt[0],
                            prevPt[1] + pt[1]
                        ];
                    }
                    prevPt = pt;

                    let longitude = pt[0] / 1e4;
                    let latitude = pt[1] / 1e4;
                    // points.push([longitude, latitude]);
                    points.push(longitude);
                    points.push(latitude);
                }

                busLines.push({
                    positions: points,
                    color: new Cesium.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0),
                    width: 2.0,
                });
            });
            this.addLineDatas(busLines,viewer);
        });
    },

    addLineDatas(busLines, viewer) {
        let scene = viewer.scene;
        busLines.forEach(line => {
            let primitive = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.PolylineGeometry({
                        positions: Cesium.Cartesian3.fromDegreesArray(line.positions),
                        width: line.width,
                    }),
                }),
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            type: 'ODLineMaterial',
                            uniforms: {
                                color_0: line.color,
                                totoalFrameCount_1: 200, //控制轨迹速度
                            },
                            source: ` 
                            uniform float totoalFrameCount_1;
                            uniform vec4 color_0; 
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;  
                                float t = mod(czm_frameNumber, totoalFrameCount_1) / totoalFrameCount_1; 
                                t *= 1.03;
                                float alpha = smoothstep(t- 0.03, t, st.s) * step(-t, -st.s); 
                                alpha += 0.1;
                                alpha *= step(-0.4, -abs(0.5-st.t));                             
                                material.diffuse = color_0.rgb;
                                material.alpha = alpha;
                                return material;
                            } 
                        `
                        },
                        translucent: true
                    }),
                    faceForward: false,
                    closed: false
                })
            });
            scene.primitives.add(primitive);
        })
    },

    destroy(viewer) {
        viewer.entities.removeAll();
    }
}
