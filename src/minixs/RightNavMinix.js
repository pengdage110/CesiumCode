export default {
    data() {
        return {
            name: 'rightnavminix',
            eventHandler: null,
            tileset: null,//内三维数据集
            dataLevels: [],//内三维数据层级列表
            BIMModels: [], //BIM模型的每个title
            hideModels: [],//已经隐藏的模型
        }
    },
    methods: {
        //加载模型数据--外模型和BIM模型如何切换交互？
        loadModel() {
            let viewer = this.$Helpers.viewer;
            let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'http://localhost:9000/model/a113ac40ba1611ebb450277f39aeff57/tileset.json',
                modelMatrix: Cesium.Matrix4.fromArray([0.9999994599615615, -0.0009583544942708966, 0.00040203637739893994, 0, 0.0009587171713715814, 0.9999991328346105, -0.0009028795115341159, 0, -0.0004011707501286599, 0.0009032644631223885, 0.9999995115875497, 0, -0.9690241585485637, 2.181826769374311, 33.28190477238968, 1]),

            }));
            viewer.flyTo(tileset);
            this.initLeftClickHandler(viewer);
        },

        //加载内三维模型
        loadInddorModel() {
            let viewer = this.$Helpers.viewer;
            this.tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'http://localhost:9000/model/1c78c180bc7a11eb8b4d8d3e66d847e8/tileset.json',
                modelMatrix: Cesium.Matrix4.fromArray([0.9999994599365517, -0.0009584130231989341, 0.00040195905586765113, 0, 0.0009587755370329964, 0.9999991329888848, -0.0009026466353970752, 0, -0.0004010935990744202, 0.0009030315364203512, 0.9999995118288657, 0, -0.9689102433621883, 2.1814272617921233, 33.27324207453057, 1]),
            }));
            let _this = this;
            this.tileset.tileLoad.addEventListener(tile => {
                _this.processTileFeatures(tile, function (data) {
                    _this.BIMModels.push(data);
                })
            })
            viewer.flyTo(this.tileset);
            this.initDataConfig('http://localhost:9000/model/7c54b1c0b91111eba646d131ed2b2fa0/scenetree.json', viewer);
            this.initLeftClickHandler(viewer);
        },

        processContentFeatures(content, callback) {
            let featuresLength = content.featuresLength;
            for (let i = 0; i < featuresLength; i++) {
                let feature = content.getFeature(i);
                callback(feature);
            }
        },
        processTileFeatures(title, callback) {
            let content = title.content;
            let innerContents = content.innerContents;
            if (Cesium.defined(innerContents)) {
                let length = innerContents.length;
                for (let i = 0; i < length; i++) {
                    this.processContentFeatures(innerContents[i], callback);
                }
            } else {
                this.processContentFeatures(content, callback);
            }
        },

        //定义左击事件
        initLeftClickHandler(viewer) {
            if (!this.eventHandler) {
                this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            }
            this.eventHandler.setInputAction(e => {
                let pickFeature = viewer.scene.pick(e.position);
                if (!Cesium.defined(pickFeature)) return;
                let id = pickFeature.getProperty('id');
                //判断选中对象所在楼层
                for (let floorInfo of this.dataLevels) {
                    if (floorInfo.modelIDs.indexOf(id)) {
                        let h = floorInfo.height;
                        //隐藏高于此楼层的所有模型
                        //this.hidenFloorModel2(40);
                        this.hidenFloorModel(40,pickFeature);
                    }
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        },

        //初始化数据层级结构
        initDataConfig(url, viewer) {
            this.dataLevels = [];
            let ellipsoid = viewer.scene.globe.ellipsoid;
            this.$http.get(url)
                .then(res => {
                    let batchId = 0;
                    for (let node of res.data.scenes) {
                        let floorInfo = { name: '', modelIDs: [], height: 0, batchIds: [] };
                        floorInfo.name = node.name;

                        let coord = node.sphere;
                        let cartesian3 = new Cesium.Cartesian3(coord[0], coord[1], coord[2]);
                        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                        floorInfo.height = cartographic.height;

                        for (let element of node.children) {
                            floorInfo.modelIDs.push(element.id);
                            floorInfo.batchIds.push(batchId);
                            batchId += 1;
                        }
                        this.dataLevels.push(floorInfo);
                    }
                }).catch(err => {
                    console.log('此数据不存在层级关系表;', err)
                })
        },

        //隐藏楼层1---测试发现只能隐藏选中的模型<_>!
        hidenFloorModel(height, feature) {
            let hideIDs = [];
            let dataset = this.tileset;
            for (let floorInfo of this.dataLevels) {
                if (floorInfo.height > height) {
                    hideIDs = hideIDs.concat(floorInfo.modelIDs);
                }
            }
            if (hideIDs.length > 0) {
                //不知道怎么直接遍历Cesium3DTileset,先从选中的feature入手吧
                let batchIds = [];
                let models = feature.content._features;
                for (let model of models) {
                    let modelId = model.getProperty('id');
                    if (hideIDs.indexOf(modelId)) {
                        model.show = false;
                        batchIds.push(model._batchId);
                    }
                }
            }
        },

        //隐藏楼层2---最蠢的遍历法
        hidenFloorModel2(height) {
            let hideIDs = [];
            this.hideModels = [];
            let dataset = this.tileset;
            for (let floorInfo of this.dataLevels) {
                if (floorInfo.height > height) {
                    hideIDs = hideIDs.concat(floorInfo.batchIds);
                }
            }
            if (hideIDs.length > 0) {
                // let hideMods = [];
                // for(let model of this.BIMModels){
                //     if(hideIDs.indexOf(model._content.batchTable._properties.id[0])>0){
                //         model.show = false;
                //         hideMods.push(model);
                //     }
                // }
                // this.hideModels = hideMods;
                let content = dataset._root._content;
                for (let id of hideIDs) {
                    let feature = content.getFeature(id);
                    if (feature) {
                        feature.show = false;
                    }
                }
            }
        }
    }
}