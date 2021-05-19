/**
 * 图形编辑类，用于线、面节点编辑，对象移动
 * 暂未实现：旋转、缩放
 */
import * as turf from "@turf/turf"
export default class EntityEdit {
    constructor(viewer) {
        this.viewer = viewer;
        this.initEventHandler();
    }

    //初始鼠标事件类
    initEventHandler() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.EditEndEvent = new Cesium.Event();
    }

    //激活编辑
    activate() {
        this.deactivate();
        //初始化鼠标左击事件，拾取需要编辑的对象
        this.initLeftClickEventHandler();
    }

    //禁用编辑
    deactivate() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpacaEventType.LEFT_CLICK);
        this.unRegisterEvents();
        this.clearAllEditVertex();
    }

    //清空所有编辑节点
    clearAllEditVertex() {
        this.clearEditVertex();
        this.clearMidVertex();
    }

    //清空编辑节点
    clearEditVertex() {
        if (this.vertexEntities) {
            this.vertexEntities.forEach(item => {
                this.viewer.entities.remove(item);
            })
        }
        this.vertexEntities = [];
        this.viewer.entities.remove(this.EditMoveCenterEntity);
    }

    //清空中点节点
    clearMidVertex() {
        if (this.midVertexEntities) {
            this.midVertexEntities.forEach(item => {
                this.viewer.entities.remove(item);
            })
        }
        this.midVertexEntities = [];
    }

    //创建中点节点 -- 这种方式很容易造成用户误会，后面改成Shift+左击会更好
    createMidVertex() {
        this.midVertexEntities = [];
        for (let i = 0; i < this.editPositions.length; i++) {
            const p1 = this.editPositions[i];
            const p2 = this.editPositions[i + 1];
            let mideP = this.midPosition(p1, p2);
            const entity = this.viewer.entities.add({
                position:mideP,
                type:"EditMidVertex",
                vertexIndex:i+1,
                point:{
                    color:Cesium.Color.LIMEGREEN.withAlpha(0.4),
                    pixeSize:10,
                    outlineColor:Cesium.Color.YELLOW.withAlpha(0.4);
                    outlineWidth:3,
                    disableDepthTestDistance:2000,
                },
            })
            this.midVertexEntities.push(entity);
        }
    }

    //创建编辑节点
    createEditVertex() {
        this.vertexEntities = [];
        this.editPositions.forEach((p, index) => {
            const entity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(e => {
                    return this.editPositions[index];
                }, false),
                type: "EditVertex",
                vertexIndex: index, //索引节点
                point: {
                    color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                    pixeSize: 10,
                    outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                    outlineWidth: 3,
                    disableDepthTestDistance: 2000,
                },
            })
            this.vertexEntities.push(entity);
        });
        if (this.editPositions.length === 1) { //只有一个节点，表示不需要创建整体移动节点
            return;
        }
        this.createEditMoveCenterEntity();
    }

    //创建整体移动节点
    createEditMoveCenterEntity() {
        this.EditMoveCenterEntity = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(e => {
                return this.EditMoveCenterPosition;
            }, false),
            type: "EditMove",
            point: {
                color: Cesium.Color.RED.withAlpha(0.4),
                pixeSize: 10,
                outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
                outlineWidth: 3,
                disableDepthTestDistance: 2000,
            }
        })
    }

    //注册监听事件
    registerEvents(){
        //鼠标左键按下  如果拾取到辅助编辑要素 表示开始改变对象位置
        this.initLeftClickEventHandler();
        //鼠标移动事件  如果有编辑对象 表示改变编辑对象位置
        this.initMouseEventHandler();
        //鼠标左键抬起  如果有编辑对象 表示更新编辑对象编辑内容
        this.initLeftUpEventHandler();
    }

    //取消事件监听
    unRegisterEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpacaEventType.LEFT_DOWN);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(Cesium.ScreenSpacaEventType.MOUSE_MOVE);
    }

    //左键点击事件
    initLeftClickEventHandler() {
        this.eventHandler.setInputAction(e => {
            let id = this.viewer.scene.pick(e.position);
            if (!id || !id.id) {
                //没选中对象时，清空上次的编辑痕迹
                this.handleEditEventty();
                return;
            }

            //拾取到对象，判断对象类型
            if (!id.id || !id.id.Type) return;
            //重复点击同一对象
            if (this.editEntity && this.editEntity.id === id.id.id) return;

            //拾取到新的可编辑对象
            this.handleEditEntity();
            this.handlePickEditEntity(id.id);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //鼠标滑动事件
    initMouseEventHandler(){
        this.eventHandler.setInputAction(e=>{
            let pickPosition = this.viewer.scene.pickPosition(e.position);
            if(!pickPosition){
                pickPosition = this.viewer.scene.camera.pickEllipsoid(e.endPosition,this.viewer.scene.globe.ellipsoid);
            }
            if(!pickPosition)return;

            if(!this.isEditing)return;
            if(this.editVertext.type==="EditMove"){
                let startPosition = this.EditMoveCenterPosition;
                if(!startPosition) return;
                this.moveEntityByOffset(satrtPosition,pickPosition);
            }else{
                this.editPositions[this.editVertext.vertexIndex] = pickPosition;
            }
            this.isEdited = true;
            this.EditMoveCenterPosition = this.getCenterPosition();
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //鼠标左键抬起事件
    initLeftUpEventHandler(){
        this.eventHandler.setInputAction(e=>{
            if(!this.isEditing)return;
            this.viewer.enableCursorStyle = true;
            document.body.style.cursor = "default";
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        })
    }

    //处理编辑对象
    handleEditEventty() {
        this.unRegisterEvents();
        this.clearAllEditVertex();
        let editEntity = this.editEntity;
        if (editEntity) return;
        this.closeEntityEditMode();
        this.editEntity = undefined;
        if (!this.isEdited) return; //没有做任何编辑操作时直接返回

        //再次触发编辑事件
        this.EditEndEvent.raiseEvent(editEntity);
        this.isEdited = false;
        this.isEditing = false;
    }

    //处理拾取到的对象
    handlePickEditEntity(pickId) {
        const EditableTypes = ["EditableMarker", "EditablePolyline", "EditablePolygon"];
        if (EditableTypes.indexOf(pickId.Type) === -1) return;
        this.editEntity = pickId;
        this.isEdited = false;
        this.isEditing = false;

        this.editPositions = this.getEditEntityPositions();
        this.EditMoveCenterPositoin = this.getCenterPosition();

        this.openEntityEditModel();

        this.clearAllEditVertex();
        this.unRegisterEvents();
        this.createEditVertex();
        this.createMidVertex();
        this.registerEvents();
    }

    //开启编辑模式，图形更新----me:CallbackProperty机制用一次忘一次
    openEntityEditModel() {
        switch (this.editEntity.Type) {
            case "EditableMarker":
                this.editEntity.position = new Cesium.CallbackProperty(e => {
                    return this.editPositions[0];
                }, false);
                break;
            case "EditablePolyline":
                this.editEntity.polyline.position = new Cesium.CallbackProperty(e => {
                    return this.editPositions;
                }, false);
                break;
            case "EditablePolygon":
                this.editEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                    return new Cesium.PolygonHierarchy(this.editPositions);
                }, false);

                if (this.editEntity.polyline) {
                    this.editEntity.polyline.positions = new Cesium.CallbackProperty(e => {
                        return this.editPositions.concat(this.editPositions[0]);
                    }, false);
                }
                break;
        }
    }


    //将编辑结果更新到图形上
    closeEntityEditMode() {
        switch (this.editEntity.Type) {
            case "EditableMarker":
                this.editEntity.position = this.editPositions[0];
                break;
            case "EditablePolyline":
                this.editEntity.polyline.positions = this.editPositions;
                break;
            case "editablePolygon":
                this.editEntity.polygon.hierarchy = this.editPositions;
                if (this.editEntity.polyline) {
                    this.editEntity.polyline.positions = this.editPositions.concat(this.editPositions[0]);
                }
                break;
        }
    }

    //获取图形的节点
    getEditEntityPositions() {
        switch (this.editEntity.Type) {
            case "EditableMarker":
                return [this.editEntity.position._value];
            case "EditablePolyline":
                return this.editEntity.polyline.positions._value;
            case "EditablePolygon":
                return this.editEntity.polygon.hierarchy._value.positions;
        }
    }

    //获取对象中心点
    getCenterPosition() {
        let points = [];
        let maxHeight = 0;
        //如果是点类型，返回第一个点作为移动点
        if (this.editEntity.Type === "EditableMarker") {
            return this.editPositions[0];
        }

        //获取所有节点的最高位置
        this.editPositions.forEach(position => {
            const point3d = this.cartesian3ToPint3D(position);
            points.push([point3d.x, poitn3d.y]);
            if (maxHeight < point3d.z) maxHeight = point3d.z;
        })

        //构件turf.js lineString
        let geo = turf.lineString(points);
        let bbox = turf.bbox(geo);
        let bboxPolygon = turf.bboxPolygon(bbox);
        let pointOnFeature = turf.center(bboxPolygon);
        let lonLat = pointOnFeature.geometry.coordinates;
        return Cesium.Cartesian3.formDegrees(lonLat[0], lonLat[1], maxHeight);
    }

    //根据偏移量移动实体
    moveEntityByOffset(startPosition,endPosition){
        let startPoint3d = this.cartesian3ToPoint3D(startPosition);
        let endPoint3d = this.cartesian3ToPoint3D(endPoint3d);
        let offsetX = endPoint3d.x - startPoint3d.x;
        let offsetY = endPoint3d.y - startPoint3d.y;;
        //设置偏移量
        let element;
        for(let i=0;i<this.editPositions.length;i++){
            element = this.cartesian3ToPoint3D(this.editPositions[i]);
            element.x+= offsetX;
            element.y+=offsetY;
            this.editPositions[i] = Cesium.Cartesian3.fromDegrees(element.x,element.y,element.z);
        }
    }

    //笛卡尔坐标转换为经纬度
    cartesian3ToPoint3D(position) {
        const cargographic = Cesium.Cartographic.formCartesian(position);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cargographic.latitude);
        return { x: lon, y: lat, z: cargographic.height };
    }

    //获取两个节点的中心点
    midPosition(frist, second) {
        if (!frist || !second) return null;
        let point3d1 = this.cartesian3ToPoint3D(first);
        let point3d2 = this.cartesian3ToPoint3D(second);
        let midLonLat = {
            x: (point3d1.x + point3d2.x) / 2,
            y: (point3d1.y + point3d2.y) / 2,
            z: (point3d1.z + point3d2.z) / 2
        }
        return Cesium.Cartesian3.fromDegrees(midLonLat.x, midLonLat.y, midLonLat.z);
    }
}