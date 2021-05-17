import { addCircleScan, addRadarScan,addCircleScanTest,addDoubleCircleRipple } from './utils/circleScan.js'
export default{
    setCircleScan:function(viewer){
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        viewer.scene.postProcessStages.removeAll();
        let $this = this;
        handler.setInputAction(function(movement){
            let position = $this._getCatesian3FromPX(movement.position,viewer);          
            let lonlatPoint = Cesium.Cartographic.fromCartesian(position);
            let x = Cesium.Math.toDegrees(lonlatPoint.longitude);
            let y = Cesium.Math.toDegrees(lonlatPoint.latitude);
            let data = {
                'lon': x,
                'lat': y,
                'r': 2000,
                'scanColor': Cesium.Color.DARKOLIVEGREEN,
                'interval': 2000
            };
            handler.destroy();
            addCircleScan(viewer, data);
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    setRadarScan:function(viewer){
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        viewer.scene.postProcessStages.removeAll();
        let $this = this;
        handler.setInputAction(function(movement){
            let position = $this._getCatesian3FromPX(movement.position,viewer);           
            let lonlatPoint = Cesium.Cartographic.fromCartesian(position);
            let x = Cesium.Math.toDegrees(lonlatPoint.longitude);
            let y = Cesium.Math.toDegrees(lonlatPoint.latitude);
            let data = {
                'lon': x,
                'lat': y,
                'r': 2000,
                'scanColor': Cesium.Color.DARKOLIVEGREEN,
                'interval': 2000
            };
            handler.destroy();
            addRadarScan(viewer, data);
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    setCircleScanTest:function(viewer){
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        viewer.scene.postProcessStages.removeAll();
        let $this = this;
        handler.setInputAction(function(movement){
            let position = $this._getCatesian3FromPX(movement.position,viewer);         
            let lonlatPoint = Cesium.Cartographic.fromCartesian(position);
            let x = Cesium.Math.toDegrees(lonlatPoint.longitude);
            let y = Cesium.Math.toDegrees(lonlatPoint.latitude);
            let data = {
                'lon': x,
                'lat': y,
                'r': 2000,
                'scanColor': Cesium.Color.DARKOLIVEGREEN,
                'interval': 2000,
                'wait':1000
            };
            let data1 = {
                'lon': x,
                'lat': y,
                'r': 1000,
                'scanColor': Cesium.Color.RED,
                'interval': 2000,
                'wait':0
            };
            handler.destroy();
            addCircleScanTest(viewer, data);
            addCircleScanTest(viewer, data1);
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    setDoubleCircleRipple:function(viewer){
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        viewer.scene.postProcessStages.removeAll();
        let $this = this;
        handler.setInputAction(function(movement){
            let position = $this._getCatesian3FromPX(movement.position,viewer);         
            let lonlatPoint = Cesium.Cartographic.fromCartesian(position);
            let x = Cesium.Math.toDegrees(lonlatPoint.longitude);
            let y = Cesium.Math.toDegrees(lonlatPoint.latitude);
            let data = {
                'lon': x,
                'lat': y,
                'height':10,
                'minR': 200,
                'maxR':2000,
                'id':['cir1','cir2'],
                'eachInterval': 1000,
                'deviationR':10,
                'imageUrl':'https://i.loli.net/2021/03/08/qp2IJGE9b4AFdWV.png'               
            };            
            handler.destroy();
            addDoubleCircleRipple(viewer, data);           
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    //屏幕坐标转笛卡尔积坐标
    _getCatesian3FromPX(px,viewer){
        let picks = viewer.scene.drillPick(px);
        viewer.render();
        let cartesian;
        let isOn3dtiles = false;
        for(let i=0;i<picks.length;i++){
            if((picks[1]&&picks[i].primitive)||picks[i] instanceof Cesium.Cesium3DTileFeature){
                isOn3dtiles = true;
            }
        }
        if(isOn3dtiles){
            cartesian = viewer.scene.pickPosition(px);
        }else{
            let ray = viewer.camera.getPickRay(px);
            if(!ray)return null;
            cartesian = viewer.scene.globe.pick(ray,viewer.scene);
        }
        return cartesian;
    }
}