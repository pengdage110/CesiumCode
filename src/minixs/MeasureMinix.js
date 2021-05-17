// import { GroundPolylinePrimitive } from "Cesium";

/**
 * 测量工具类
 * 空间距离测量
 * 空间面积测量
 */
export default {
    data() {
        return {
            name: 'measureminix',
            eventHandler: null
        }
    },
    methods: {
        /**
         * 空间直线距离测量--允许连续点击
         */
        measureLineSpace(viewer) {
            //取消默认的双击事件
            viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            var positions = [];
            var polyline = null;
            var distance = 0;
            var cartesian = null;

            //鼠标移动
            this.eventHandler.setInputAction(function (movement) {
                var ray = viewer.camera.getPickRay(movement.endPosition);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length >= 2) {
                    if (!Cesium.defined(polyline)) {
                        polyline = new GroundPolylinePrimitive(positions);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                    distance = getSpaceDistan(positions);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            //鼠标点击
            this.eventHandler.setInputAction(function (movement) {
                var ray = viewer.camera.getPickRay(movement.position);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                var distanceTxt = distance + '米';
                //添加标注
                viewer.entities.add({
                    name: '空间距离测量' + Date.now(),
                    position:positions[positions.length-1],
                    point:{
                        pixelSize:5,
                        color:Cesium.Color.WHITE,
                        outlineWidth:2
                    },
                    label:{
                        text:distanceTxt,
                        font:'18px sans-serif',
                        fillColor:Cesium.Color.GOLD,
                        style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outleneWidth:2,
                        verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset:new Cesium.Cartesian2(20,-20)                      
                    }
                })
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            //右键结束绘制
            this.eventHandler.setInputAction(function(movement){
                this.eventHandler.destroy();
                positions.pop();
            },Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            var PolylinePrimitive = (function(){
                function _(position){
                    
                }
            })
        }
    }
}