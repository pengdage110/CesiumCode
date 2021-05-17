export default {
    data() {
        return {
            name: 'leftnavminix',
            //viewer.screenSpaceEventHandler销毁后暂时不知道怎么重新初始化，用自定义Handler也是个很好的办法
            eventHandler: null
        }
    },
    methods: {
        //点击选择
        featureSelcet() {
            var viewer = this.$Helpers.viewer;
            if (this.eventHandler == null || this.eventHandler.isDestroyed()) {
                this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            }
            var selected = {
                feature: undefined,
                originaColor: new Cesium.Color()
            };
            var selectedEntity = new Cesium.Entity();

            var clickHandler = this.eventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            //是否支持深度纹理检测--是否可以获取并修改物体轮廓颜色
            if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
                //创建边缘设置对象，鼠标悬停时对象轮廓为绿色，选中后为红色
                var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
                silhouetteGreen.uniforms.color = Cesium.Color.GREEN;
                silhouetteGreen.uniforms.length = 0.01; //轮廓线宽
                silhouetteGreen.selected = [];

                var silhouetteRed = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
                silhouetteRed.uniforms.color = Cesium.Color.RED;
                silhouetteRed.uniforms.length = 0.01;
                silhouetteRed.selected = [];

                viewer.scene.postProcessStages.add(
                    Cesium.PostProcessStageLibrary.createSilhouetteStage([
                        silhouetteGreen,
                        silhouetteRed
                    ])
                );

                //鼠标滑动选择
                this.eventHandler.setInputAction(function onMouseMove(movement) {
                    silhouetteGreen.selected = [];
                    var pickedFeature = viewer.scene.pick(movement.endPosition);
                    if (pickedFeature == null) return;
                    //1、将选中对象赋值给边缘渲染对象  -- 边缘渲染有明显的视角问题             
                    // if (pickedFeature !== selected.feature) {
                    //     silhouetteGreen.selected = [pickedFeature];
                    // }

                    //2、选中对象直接高亮
                    if (pickedFeature !== selected.feature) {
                        if (selected.feature != null) {
                            selected.feature.color = selected.originaColor;
                        }
                        pickedFeature.color = Cesium.Color.YELLOW.withAlpha(0.5);
                        selected.feature = pickedFeature;
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                //鼠标左击选择
                this.eventHandler.setInputAction(function onLeftClick(movement) {
                    silhouetteRed.selected = [];
                    var pickedFeature = viewer.scene.pick(movement.position);
                    if (!Cesium.defined(pickedFeature)) {
                        //再点击一次是什么意思？？
                        clickHandler(movement);
                        return;
                    }
                    if (silhouetteRed.selected[0] === pickedFeature) return;
                    var highightedFeature = silhouetteGreen.selected[0];
                    if (pickedFeature === highightedFeature) {
                        silhouetteGreen.selected == [];
                    }
                    silhouetteRed.selected = [pickedFeature];
                    pickedFeature.color = Cesium.Color.RED.withAlpha(0.8);
                    var filedNames = pickedFeature.getPropertyNames();
                    for (var i in filedNames) {
                        var name = filedNames[i];
                        console.log(name + ' : ' + pickedFeature.getProperty(name));
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            } else {
                alert('当前浏览器不支持深度纹理拾取');
            }
        },

        //取消选择状态
        UnSelect() {
            if (this.eventHandler) {
                this.eventHandler.destroy();
            }
            this.autoRotate(false);
        },

        //开启场景旋转,当视角低于height时停止旋转
        //此方法适应于地球的开场高空动画，稍微修改可用于绕轴自旋转
        autoRotate(isRotate, height) {
            let viewer = this.$Helpers.viewer;
            let i = Date.now();
            function rotate() {
                let t = Date.now();
                let n = (t - i) / 1e3;
                i = t;
                viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.1 * n);
            }
            function cameraChange() {
                const currentH = Math.ceil(viewer.camera.positionCartographic.height);//取整数
                if (currentH < height) {
                    viewer.clock.onTick.removeEventListener(rotate);
                } else {
                    viewer.clock.onTick.addEventListener(rotate);
                }
            }
            if (isRotate) {
                viewer.clock.onTick.addEventListener(rotate);
                viewer.camera.changed.addEventListener(cameraChange)
            } else {
                let a = viewer.clock.onTick.removeEventListener(rotate);
                let b = viewer.camera.changed.removeEventListener(cameraChange);
            }
        }
    }
}