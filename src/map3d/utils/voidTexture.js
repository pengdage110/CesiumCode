var PrimitiveTexture= (
	function () {
		var vertexShader;
		var fragmentShader;
		var materialShader;
        var video;
        var viewer;
		function _(options) {
 
			vertexShader = getVS();
			fragmentShader = getFS();
			materialShader = getMS();
            video = options.video;
            viewer = options.viewer;
 
			var postionsTemp = [];
			//纹理坐标，调整纹理坐标顺序即可完成贴图的旋转
			var stsTemp = [0.0,0.0,0.0,1.0,1.0,1.0,1.0,0.0];
			//索引数组
			var indicesTesm = [0,1,2,0,2,3];
 
			for (var i = 0; i < options.Cartesians.length; i++) {
				postionsTemp.push(options.Cartesians[i].x);
				postionsTemp.push(options.Cartesians[i].y);
				postionsTemp.push(options.Cartesians[i].z);
			}
			console.log("pos:"+postionsTemp)
			let positionArr = new Float32Array(postionsTemp);
			let sts = new Float32Array(stsTemp);
			let indiceArr = new Uint16Array(indicesTesm);
			//通过坐标数组，索引数组，纹理坐标数组创建多边形
			let geometry = CreateGeometry(positionArr, sts, indiceArr);
			let appearance = CreateAppearence(fragmentShader, vertexShader,materialShader,video);
			let primitive = viewer.scene.primitives.add(new Cesium.Primitive({
				geometryInstances: new Cesium.GeometryInstance({
					geometry: geometry,
				}),
				appearance: appearance,
				asynchronous: false
			}));
		}
		
		function CreateGeometry(positions, sts, indices) {
			let sess= new Cesium.GeometryAttribute({
			componentDatatype: Cesium.ComponentDatatype.FLOAT,
			componentsPerAttribute: 2,
			values: sts
		})
		return new Cesium.Geometry({
			attributes: {
				position: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: 3,
					values: positions
				}),
				st:sess
			},
			indices: indices,
			primitiveType: Cesium.PrimitiveType.TRIANGLES,
			boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
		});
    }
	
	
    function CreateAppearence(fs, vs,ms,video) {
		function NewMaterial(){
			var material = new Cesium.Material({
				fabric: {
					type : 'myImage',
					uniforms:{
						image : ""
					},
					source: ms
				}
			});
			material.uniforms.image = video;
			return material;
		}
	
		return new Cesium.Appearance({
			material: NewMaterial(),
			aboveGround: true,
			faceForward: true,
			flat: true,
			translucent: false,
			renderState: {
				blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
				depthTest: { enabled: true },
				depthMask: true,
			},
			fragmentShaderSource: fs,
			vertexShaderSource: vs
		});
    }
    
	function getVS() {
		return "attribute vec3 position3DHigh;\
            attribute vec3 position3DLow;\
            attribute vec2 st;\
            attribute float batchId;\
            varying vec2 v_st;\
            void main()\
            {\
                vec4 p = czm_computePosition();\
                v_st=st;\
                p = czm_modelViewProjectionRelativeToEye * p;\
                gl_Position = p;\
            }\
            ";
    }
    function getFS() {
		return "varying vec2 v_st;\
            void main()\
            {\
                czm_materialInput materialInput;\
                czm_material material=czm_getMaterial(materialInput,v_st);\
                vec4 color=vec4(material.diffuse + material.emission,material.alpha);\
                if(color.x == 1.0&&color.y == 1.0&&color.z == 1.0&&color.w == 1.0) color=vec4(vec3(0.0,0.0,0.0),0.0);\
                gl_FragColor =color;\
            }\
            ";
    }
    function getMS() {
      return "czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
            {\
                vec4 color = texture2D(image, v_st);\
                czm_material material = czm_getDefaultMaterial(materialInput);\
                material.diffuse = color.rgb;\
                material.alpha = 0;\
                return material;\
            }\
            ";
    }
    return _;
  })()

  export { PrimitiveTexture }