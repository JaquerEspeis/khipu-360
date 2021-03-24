const _m1 = new THREE.Matrix4();
const _obj = new THREE.Object3D();
const _offset = new THREE.Vector3();

function Geometry() {

	this.uuid = THREE.MathUtils.generateUUID();

	this.name = '';
	this.type = 'Geometry';

	this.vertices = [];
	this.colors = [];
	this.faces = [];
	this.faceVertexUvs = [[]];

	this.morphTargets = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	// update flags

	this.elementsNeedUpdate = false;
	this.verticesNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;
	this.groupsNeedUpdate = false;

}

Geometry.prototype = Object.assign( Object.create( THREE.EventDispatcher.prototype ), {

	constructor: Geometry,

	isGeometry: true,

	applyMatrix4: function ( matrix ) {

		const normalMatrix = new Matrix3().getNormalMatrix( matrix );

		for ( let i = 0, il = this.vertices.length; i < il; i ++ ) {

			const vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( let i = 0, il = this.faces.length; i < il; i ++ ) {

			const face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( let j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		this.verticesNeedUpdate = true;
		this.normalsNeedUpdate = true;

		return this;

	},

	rotateX: function ( angle ) {

		// rotate geometry around world x-axis

		_m1.makeRotationX( angle );

		this.applyMatrix4( _m1 );

		return this;

	},

	rotateY: function ( angle ) {

		// rotate geometry around world y-axis

		_m1.makeRotationY( angle );

		this.applyMatrix4( _m1 );

		return this;

	},

	rotateZ: function ( angle ) {

		// rotate geometry around world z-axis

		_m1.makeRotationZ( angle );

		this.applyMatrix4( _m1 );

		return this;

	},

	translate: function ( x, y, z ) {

		// translate geometry

		_m1.makeTranslation( x, y, z );

		this.applyMatrix4( _m1 );

		return this;

	},

	scale: function ( x, y, z ) {

		// scale geometry

		_m1.makeScale( x, y, z );

		this.applyMatrix4( _m1 );

		return this;

	},

	lookAt: function ( vector ) {

		_obj.lookAt( vector );

		_obj.updateMatrix();

		this.applyMatrix4( _obj.matrix );

		return this;

	},

	fromBufferGeometry: function ( geometry ) {

		const scope = this;

		const index = geometry.index !== null ? geometry.index : undefined;
		const attributes = geometry.attributes;

		if ( attributes.position === undefined ) {

			console.error( 'THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion.' );
			return this;

		}

		const position = attributes.position;
		const normal = attributes.normal;
		const color = attributes.color;
		const uv = attributes.uv;
		const uv2 = attributes.uv2;

		if ( uv2 !== undefined ) this.faceVertexUvs[ 1 ] = [];

		for ( let i = 0; i < position.count; i ++ ) {

			scope.vertices.push( new THREE.Vector3().fromBufferAttribute( position, i ) );

			if ( color !== undefined ) {

				scope.colors.push( new THREE.Color().fromBufferAttribute( color, i ) );

			}

		}

		function addFace( a, b, c, materialIndex ) {

			const vertexColors = ( color === undefined ) ? [] : [
				scope.colors[ a ].clone(),
				scope.colors[ b ].clone(),
				scope.colors[ c ].clone()
			];

			const vertexNormals = ( normal === undefined ) ? [] : [
				new THREE.Vector3().fromBufferAttribute( normal, a ),
				new THREE.Vector3().fromBufferAttribute( normal, b ),
				new THREE.Vector3().fromBufferAttribute( normal, c )
			];

			const face = new Face3( a, b, c, vertexNormals, vertexColors, materialIndex );

			scope.faces.push( face );

			if ( uv !== undefined ) {

				scope.faceVertexUvs[ 0 ].push( [
					new THREE.Vector2().fromBufferAttribute( uv, a ),
					new THREE.Vector2().fromBufferAttribute( uv, b ),
					new THREE.Vector2().fromBufferAttribute( uv, c )
				] );

			}

			if ( uv2 !== undefined ) {

				scope.faceVertexUvs[ 1 ].push( [
					new THREE.Vector2().fromBufferAttribute( uv2, a ),
					new THREE.Vector2().fromBufferAttribute( uv2, b ),
					new THREE.Vector2().fromBufferAttribute( uv2, c )
				] );

			}

		}

		const groups = geometry.groups;

		if ( groups.length > 0 ) {

			for ( let i = 0; i < groups.length; i ++ ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					if ( index !== undefined ) {

						addFace( index.getX( j ), index.getX( j + 1 ), index.getX( j + 2 ), group.materialIndex );

					} else {

						addFace( j, j + 1, j + 2, group.materialIndex );

					}

				}

			}

		} else {

			if ( index !== undefined ) {

				for ( let i = 0; i < index.count; i += 3 ) {

					addFace( index.getX( i ), index.getX( i + 1 ), index.getX( i + 2 ) );

				}

			} else {

				for ( let i = 0; i < position.count; i += 3 ) {

					addFace( i, i + 1, i + 2 );

				}

			}

		}

		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		this.boundingBox.getCenter( _offset ).negate();

		this.translate( _offset.x, _offset.y, _offset.z );

		return this;

	},

	normalize: function () {

		this.computeBoundingSphere();

		const center = this.boundingSphere.center;
		const radius = this.boundingSphere.radius;

		const s = radius === 0 ? 1 : 1.0 / radius;

		const matrix = new Matrix4();
		matrix.set(
			s, 0, 0, - s * center.x,
			0, s, 0, - s * center.y,
			0, 0, s, - s * center.z,
			0, 0, 0, 1
		);

		this.applyMatrix4( matrix );

		return this;

	},

	computeFaceNormals: function () {

		const cb = new THREE.Vector3(), ab = new THREE.Vector3();

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			const face = this.faces[ f ];

			const vA = this.vertices[ face.a ];
			const vB = this.vertices[ face.b ];
			const vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: function ( areaWeighted = true ) {

		const vertices = new Array( this.vertices.length );

		for ( let v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new THREE.Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			const cb = new THREE.Vector3(), ab = new THREE.Vector3();

			for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

				const face = this.faces[ f ];

				const vA = this.vertices[ face.a ];
				const vB = this.vertices[ face.b ];
				const vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			this.computeFaceNormals();

			for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

				const face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( let v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			const face = this.faces[ f ];

			const vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( vertices[ face.a ] );
				vertexNormals[ 1 ].copy( vertices[ face.b ] );
				vertexNormals[ 2 ].copy( vertices[ face.c ] );

			} else {

				vertexNormals[ 0 ] = vertices[ face.a ].clone();
				vertexNormals[ 1 ] = vertices[ face.b ].clone();
				vertexNormals[ 2 ] = vertices[ face.c ].clone();

			}

		}

		if ( this.faces.length > 0 ) {

			this.normalsNeedUpdate = true;

		}

	},

	computeFlatVertexNormals: function () {

		this.computeFaceNormals();

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			const face = this.faces[ f ];

			const vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( face.normal );
				vertexNormals[ 1 ].copy( face.normal );
				vertexNormals[ 2 ].copy( face.normal );

			} else {

				vertexNormals[ 0 ] = face.normal.clone();
				vertexNormals[ 1 ] = face.normal.clone();
				vertexNormals[ 2 ] = face.normal.clone();

			}

		}

		if ( this.faces.length > 0 ) {

			this.normalsNeedUpdate = true;

		}

	},

	computeMorphNormals: function () {

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			const face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( let i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		const tmpGeo = new Geometry();
		tmpGeo.faces = this.faces;

		for ( let i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				const dstNormalsFace = this.morphNormals[ i ].faceNormals;
				const dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

					const faceNormal = new THREE.Vector3();
					const vertexNormals = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			const morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

				const face = this.faces[ f ];

				const faceNormal = morphNormals.faceNormals[ f ];
				const vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			const face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	},

	computeBoundingSphere: function () {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	},

	merge: function ( geometry, matrix, materialIndexOffset = 0 ) {

		if ( ! ( geometry && geometry.isGeometry ) ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		let normalMatrix;
		const vertexOffset = this.vertices.length,
			vertices1 = this.vertices,
			vertices2 = geometry.vertices,
			faces1 = this.faces,
			faces2 = geometry.faces,
			colors1 = this.colors,
			colors2 = geometry.colors;

		if ( matrix !== undefined ) {

			normalMatrix = new Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( let i = 0, il = vertices2.length; i < il; i ++ ) {

			const vertex = vertices2[ i ];

			const vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// colors

		for ( let i = 0, il = colors2.length; i < il; i ++ ) {

			colors1.push( colors2[ i ].clone() );

		}

		// faces

		for ( let i = 0, il = faces2.length; i < il; i ++ ) {

			const face = faces2[ i ];
			let normal, color;
			const faceVertexNormals = face.vertexNormals,
				faceVertexColors = face.vertexColors;

			const faceCopy = new Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( let j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( let j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( let i = 0, il = geometry.faceVertexUvs.length; i < il; i ++ ) {

			const faceVertexUvs2 = geometry.faceVertexUvs[ i ];

			if ( this.faceVertexUvs[ i ] === undefined ) this.faceVertexUvs[ i ] = [];

			for ( let j = 0, jl = faceVertexUvs2.length; j < jl; j ++ ) {

				const uvs2 = faceVertexUvs2[ j ], uvsCopy = [];

				for ( let k = 0, kl = uvs2.length; k < kl; k ++ ) {

					uvsCopy.push( uvs2[ k ].clone() );

				}

				this.faceVertexUvs[ i ].push( uvsCopy );

			}

		}

	},

	mergeMesh: function ( mesh ) {

		if ( ! ( mesh && mesh.isMesh ) ) {

			console.error( 'THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh );
			return;

		}

		if ( mesh.matrixAutoUpdate ) mesh.updateMatrix();

		this.merge( mesh.geometry, mesh.matrix );

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function ( precisionPoints = 4 ) {

		const verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
		const unique = [], changes = [];

		const precision = Math.pow( 10, precisionPoints );

		for ( let i = 0, il = this.vertices.length; i < il; i ++ ) {

			const v = this.vertices[ i ];
			const key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		}


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		const faceIndicesToRemove = [];

		for ( let i = 0, il = this.faces.length; i < il; i ++ ) {

			const face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			const indices = [ face.a, face.b, face.c ];

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( let n = 0; n < 3; n ++ ) {

				if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

					faceIndicesToRemove.push( i );
					break;

				}

			}

		}

		for ( let i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

			const idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( let j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		const diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	},

	setFromPoints: function ( points ) {

		this.vertices = [];

		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const point = points[ i ];
			this.vertices.push( new THREE.Vector3( point.x, point.y, point.z || 0 ) );

		}

		return this;

	},

	sortFacesByMaterialIndex: function () {

		const faces = this.faces;
		const length = faces.length;

		// tag faces

		for ( let i = 0; i < length; i ++ ) {

			faces[ i ]._id = i;

		}

		// sort faces

		function materialIndexSort( a, b ) {

			return a.materialIndex - b.materialIndex;

		}

		faces.sort( materialIndexSort );

		// sort uvs

		const uvs1 = this.faceVertexUvs[ 0 ];
		const uvs2 = this.faceVertexUvs[ 1 ];

		let newUvs1, newUvs2;

		if ( uvs1 && uvs1.length === length ) newUvs1 = [];
		if ( uvs2 && uvs2.length === length ) newUvs2 = [];

		for ( let i = 0; i < length; i ++ ) {

			const id = faces[ i ]._id;

			if ( newUvs1 ) newUvs1.push( uvs1[ id ] );
			if ( newUvs2 ) newUvs2.push( uvs2[ id ] );

		}

		if ( newUvs1 ) this.faceVertexUvs[ 0 ] = newUvs1;
		if ( newUvs2 ) this.faceVertexUvs[ 1 ] = newUvs2;

	},

	toJSON: function () {

		const data = {
			metadata: {
				version: 4.5,
				type: 'Geometry',
				generator: 'Geometry.toJSON'
			}
		};

		// standard Geometry serialization

		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			const parameters = this.parameters;

			for ( const key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		const vertices = [];

		for ( let i = 0; i < this.vertices.length; i ++ ) {

			const vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		const faces = [];
		const normals = [];
		const normalsHash = {};
		const colors = [];
		const colorsHash = {};
		const uvs = [];
		const uvsHash = {};

		for ( let i = 0; i < this.faces.length; i ++ ) {

			const face = this.faces[ i ];

			const hasMaterial = true;
			const hasFaceUv = false; // deprecated
			const hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			const hasFaceNormal = face.normal.length() > 0;
			const hasFaceVertexNormal = face.vertexNormals.length > 0;
			const hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			const hasFaceVertexColor = face.vertexColors.length > 0;

			let faceType = 0;

			faceType = setBit( faceType, 0, 0 ); // isQuad
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );
			faces.push( face.materialIndex );

			if ( hasFaceVertexUv ) {

				const faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				const vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				const vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position ) );

		}

		function getNormalIndex( normal ) {

			const hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			const hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			const hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		data.data = {};

		data.data.vertices = vertices;
		data.data.normals = normals;
		if ( colors.length > 0 ) data.data.colors = colors;
		if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
		data.data.faces = faces;

		return data;

	},

	clone: function () {

		/*
		 // Handle primitives

		 const parameters = this.parameters;

		 if ( parameters !== undefined ) {

		 const values = [];

		 for ( const key in parameters ) {

		 values.push( parameters[ key ] );

		 }

		 const geometry = Object.create( this.constructor.prototype );
		 this.constructor.apply( geometry, values );
		 return geometry;

		 }

		 return new this.constructor().copy( this );
		 */

		return new Geometry().copy( this );

	},

	copy: function ( source ) {

		// reset

		this.vertices = [];
		this.colors = [];
		this.faces = [];
		this.faceVertexUvs = [[]];
		this.morphTargets = [];
		this.morphNormals = [];
		this.skinWeights = [];
		this.skinIndices = [];
		this.lineDistances = [];
		this.boundingBox = null;
		this.boundingSphere = null;

		// name

		this.name = source.name;

		// vertices

		const vertices = source.vertices;

		for ( let i = 0, il = vertices.length; i < il; i ++ ) {

			this.vertices.push( vertices[ i ].clone() );

		}

		// colors

		const colors = source.colors;

		for ( let i = 0, il = colors.length; i < il; i ++ ) {

			this.colors.push( colors[ i ].clone() );

		}

		// faces

		const faces = source.faces;

		for ( let i = 0, il = faces.length; i < il; i ++ ) {

			this.faces.push( faces[ i ].clone() );

		}

		// face vertex uvs

		for ( let i = 0, il = source.faceVertexUvs.length; i < il; i ++ ) {

			const faceVertexUvs = source.faceVertexUvs[ i ];

			if ( this.faceVertexUvs[ i ] === undefined ) {

				this.faceVertexUvs[ i ] = [];

			}

			for ( let j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

				const uvs = faceVertexUvs[ j ], uvsCopy = [];

				for ( let k = 0, kl = uvs.length; k < kl; k ++ ) {

					const uv = uvs[ k ];

					uvsCopy.push( uv.clone() );

				}

				this.faceVertexUvs[ i ].push( uvsCopy );

			}

		}

		// morph targets

		const morphTargets = source.morphTargets;

		for ( let i = 0, il = morphTargets.length; i < il; i ++ ) {

			const morphTarget = {};
			morphTarget.name = morphTargets[ i ].name;

			// vertices

			if ( morphTargets[ i ].vertices !== undefined ) {

				morphTarget.vertices = [];

				for ( let j = 0, jl = morphTargets[ i ].vertices.length; j < jl; j ++ ) {

					morphTarget.vertices.push( morphTargets[ i ].vertices[ j ].clone() );

				}

			}

			// normals

			if ( morphTargets[ i ].normals !== undefined ) {

				morphTarget.normals = [];

				for ( let j = 0, jl = morphTargets[ i ].normals.length; j < jl; j ++ ) {

					morphTarget.normals.push( morphTargets[ i ].normals[ j ].clone() );

				}

			}

			this.morphTargets.push( morphTarget );

		}

		// morph normals

		const morphNormals = source.morphNormals;

		for ( let i = 0, il = morphNormals.length; i < il; i ++ ) {

			const morphNormal = {};

			// vertex normals

			if ( morphNormals[ i ].vertexNormals !== undefined ) {

				morphNormal.vertexNormals = [];

				for ( let j = 0, jl = morphNormals[ i ].vertexNormals.length; j < jl; j ++ ) {

					const srcVertexNormal = morphNormals[ i ].vertexNormals[ j ];
					const destVertexNormal = {};

					destVertexNormal.a = srcVertexNormal.a.clone();
					destVertexNormal.b = srcVertexNormal.b.clone();
					destVertexNormal.c = srcVertexNormal.c.clone();

					morphNormal.vertexNormals.push( destVertexNormal );

				}

			}

			// face normals

			if ( morphNormals[ i ].faceNormals !== undefined ) {

				morphNormal.faceNormals = [];

				for ( let j = 0, jl = morphNormals[ i ].faceNormals.length; j < jl; j ++ ) {

					morphNormal.faceNormals.push( morphNormals[ i ].faceNormals[ j ].clone() );

				}

			}

			this.morphNormals.push( morphNormal );

		}

		// skin weights

		const skinWeights = source.skinWeights;

		for ( let i = 0, il = skinWeights.length; i < il; i ++ ) {

			this.skinWeights.push( skinWeights[ i ].clone() );

		}

		// skin indices

		const skinIndices = source.skinIndices;

		for ( let i = 0, il = skinIndices.length; i < il; i ++ ) {

			this.skinIndices.push( skinIndices[ i ].clone() );

		}

		// line distances

		const lineDistances = source.lineDistances;

		for ( let i = 0, il = lineDistances.length; i < il; i ++ ) {

			this.lineDistances.push( lineDistances[ i ] );

		}

		// bounding box

		const boundingBox = source.boundingBox;

		if ( boundingBox !== null ) {

			this.boundingBox = boundingBox.clone();

		}

		// bounding sphere

		const boundingSphere = source.boundingSphere;

		if ( boundingSphere !== null ) {

			this.boundingSphere = boundingSphere.clone();

		}

		// update flags

		this.elementsNeedUpdate = source.elementsNeedUpdate;
		this.verticesNeedUpdate = source.verticesNeedUpdate;
		this.uvsNeedUpdate = source.uvsNeedUpdate;
		this.normalsNeedUpdate = source.normalsNeedUpdate;
		this.colorsNeedUpdate = source.colorsNeedUpdate;
		this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
		this.groupsNeedUpdate = source.groupsNeedUpdate;

		return this;

	},

	toBufferGeometry: function () {

		const geometry = new DirectGeometry().fromGeometry( this );

		const buffergeometry = new BufferGeometry();

		const positions = new Float32Array( geometry.vertices.length * 3 );
		buffergeometry.setAttribute( 'position', new BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

		if ( geometry.normals.length > 0 ) {

			const normals = new Float32Array( geometry.normals.length * 3 );
			buffergeometry.setAttribute( 'normal', new BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

		}

		if ( geometry.colors.length > 0 ) {

			const colors = new Float32Array( geometry.colors.length * 3 );
			buffergeometry.setAttribute( 'color', new BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

		}

		if ( geometry.uvs.length > 0 ) {

			const uvs = new Float32Array( geometry.uvs.length * 2 );
			buffergeometry.setAttribute( 'uv', new BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

		}

		if ( geometry.uvs2.length > 0 ) {

			const uvs2 = new Float32Array( geometry.uvs2.length * 2 );
			buffergeometry.setAttribute( 'uv2', new BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

		}

		// groups

		buffergeometry.groups = geometry.groups;

		// morphs

		for ( const name in geometry.morphTargets ) {

			const array = [];
			const morphTargets = geometry.morphTargets[ name ];

			for ( let i = 0, l = morphTargets.length; i < l; i ++ ) {

				const morphTarget = morphTargets[ i ];

				const attribute = new Float32BufferAttribute( morphTarget.data.length * 3, 3 );
				attribute.name = morphTarget.name;

				array.push( attribute.copyVector3sArray( morphTarget.data ) );

			}

			buffergeometry.morphAttributes[ name ] = array;

		}

		// skinning

		if ( geometry.skinIndices.length > 0 ) {

			const skinIndices = new Float32BufferAttribute( geometry.skinIndices.length * 4, 4 );
			buffergeometry.setAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

		}

		if ( geometry.skinWeights.length > 0 ) {

			const skinWeights = new Float32BufferAttribute( geometry.skinWeights.length * 4, 4 );
			buffergeometry.setAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

		}

		//

		if ( geometry.boundingSphere !== null ) {

			buffergeometry.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			buffergeometry.boundingBox = geometry.boundingBox.clone();

		}

		return buffergeometry;

	},

	computeTangents: function () {

		console.error( 'THREE.Geometry: .computeTangents() has been removed.' );

	},

	computeLineDistances: function () {

		console.error( 'THREE.Geometry: .computeLineDistances() has been removed. Use THREE.Line.computeLineDistances() instead.' );

	},

	applyMatrix: function ( matrix ) {

		console.warn( 'THREE.Geometry: .applyMatrix() has been renamed to .applyMatrix4().' );
		return this.applyMatrix4( matrix );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

} );

Geometry.createBufferGeometryFromObject = function ( object ) {

	let buffergeometry = new BufferGeometry();

	const geometry = object.geometry;

	if ( object.isPoints || object.isLine ) {

		const positions = new Float32BufferAttribute( geometry.vertices.length * 3, 3 );
		const colors = new Float32BufferAttribute( geometry.colors.length * 3, 3 );

		buffergeometry.setAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
		buffergeometry.setAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

		if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

			const lineDistances = new Float32BufferAttribute( geometry.lineDistances.length, 1 );

			buffergeometry.setAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

		}

		if ( geometry.boundingSphere !== null ) {

			buffergeometry.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			buffergeometry.boundingBox = geometry.boundingBox.clone();

		}

	} else if ( object.isMesh ) {

		buffergeometry = geometry.toBufferGeometry();

	}

	return buffergeometry;

};

class DirectGeometry {

	constructor() {

		this.vertices = [];
		this.normals = [];
		this.colors = [];
		this.uvs = [];
		this.uvs2 = [];

		this.groups = [];

		this.morphTargets = {};

		this.skinWeights = [];
		this.skinIndices = [];

		// this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.verticesNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.groupsNeedUpdate = false;

	}

	computeGroups( geometry ) {

		const groups = [];

		let group, i;
		let materialIndex = undefined;

		const faces = geometry.faces;

		for ( i = 0; i < faces.length; i ++ ) {

			const face = faces[ i ];

			// materials

			if ( face.materialIndex !== materialIndex ) {

				materialIndex = face.materialIndex;

				if ( group !== undefined ) {

					group.count = ( i * 3 ) - group.start;
					groups.push( group );

				}

				group = {
					start: i * 3,
					materialIndex: materialIndex
				};

			}

		}

		if ( group !== undefined ) {

			group.count = ( i * 3 ) - group.start;
			groups.push( group );

		}

		this.groups = groups;

	}

	fromGeometry( geometry ) {

		const faces = geometry.faces;
		const vertices = geometry.vertices;
		const faceVertexUvs = geometry.faceVertexUvs;

		const hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
		const hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

		// morphs

		const morphTargets = geometry.morphTargets;
		const morphTargetsLength = morphTargets.length;

		let morphTargetsPosition;

		if ( morphTargetsLength > 0 ) {

			morphTargetsPosition = [];

			for ( let i = 0; i < morphTargetsLength; i ++ ) {

				morphTargetsPosition[ i ] = {
					name: morphTargets[ i ].name,
				 	data: []
				};

			}

			this.morphTargets.position = morphTargetsPosition;

		}

		const morphNormals = geometry.morphNormals;
		const morphNormalsLength = morphNormals.length;

		let morphTargetsNormal;

		if ( morphNormalsLength > 0 ) {

			morphTargetsNormal = [];

			for ( let i = 0; i < morphNormalsLength; i ++ ) {

				morphTargetsNormal[ i ] = {
					name: morphNormals[ i ].name,
				 	data: []
				};

			}

			this.morphTargets.normal = morphTargetsNormal;

		}

		// skins

		const skinIndices = geometry.skinIndices;
		const skinWeights = geometry.skinWeights;

		const hasSkinIndices = skinIndices.length === vertices.length;
		const hasSkinWeights = skinWeights.length === vertices.length;

		//

		if ( vertices.length > 0 && faces.length === 0 ) {

			console.error( 'THREE.DirectGeometry: Faceless geometries are not supported.' );

		}

		for ( let i = 0; i < faces.length; i ++ ) {

			const face = faces[ i ];

			this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

			const vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

			} else {

				const normal = face.normal;

				this.normals.push( normal, normal, normal );

			}

			const vertexColors = face.vertexColors;

			if ( vertexColors.length === 3 ) {

				this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

			} else {

				const color = face.color;

				this.colors.push( color, color, color );

			}

			if ( hasFaceVertexUv === true ) {

				const vertexUvs = faceVertexUvs[ 0 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i );

					this.uvs.push( new Vector2(), new Vector2(), new Vector2() );

				}

			}

			if ( hasFaceVertexUv2 === true ) {

				const vertexUvs = faceVertexUvs[ 1 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );

					this.uvs2.push( new Vector2(), new Vector2(), new Vector2() );

				}

			}

			// morphs

			for ( let j = 0; j < morphTargetsLength; j ++ ) {

				const morphTarget = morphTargets[ j ].vertices;

				morphTargetsPosition[ j ].data.push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

			}

			for ( let j = 0; j < morphNormalsLength; j ++ ) {

				const morphNormal = morphNormals[ j ].vertexNormals[ i ];

				morphTargetsNormal[ j ].data.push( morphNormal.a, morphNormal.b, morphNormal.c );

			}

			// skins

			if ( hasSkinIndices ) {

				this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

			}

			if ( hasSkinWeights ) {

				this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

			}

		}

		this.computeGroups( geometry );

		this.verticesNeedUpdate = geometry.verticesNeedUpdate;
		this.normalsNeedUpdate = geometry.normalsNeedUpdate;
		this.colorsNeedUpdate = geometry.colorsNeedUpdate;
		this.uvsNeedUpdate = geometry.uvsNeedUpdate;
		this.groupsNeedUpdate = geometry.groupsNeedUpdate;

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		return this;

	}

}

class Face3 {

	constructor( a, b, c, normal, color, materialIndex = 0 ) {

		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = ( normal && normal.isVector3 ) ? normal : new THREE.Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color && color.isColor ) ? color : new THREE.Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex;

	}

	clone() {

		return new this.constructor().copy( this );

	}

	copy( source ) {

		this.a = source.a;
		this.b = source.b;
		this.c = source.c;

		this.normal.copy( source.normal );
		this.color.copy( source.color );

		this.materialIndex = source.materialIndex;

		for ( let i = 0, il = source.vertexNormals.length; i < il; i ++ ) {

			this.vertexNormals[ i ] = source.vertexNormals[ i ].clone();

		}

		for ( let i = 0, il = source.vertexColors.length; i < il; i ++ ) {

			this.vertexColors[ i ] = source.vertexColors[ i ].clone();

		}

		return this;

	}

}

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	AFRAME.registerComponent('glow', {
	  schema: {
	    enabled: {default: true},
	    c: {type: 'number', default: 1 },
	    p: {type: 'number', default: 1.4 },
	    color: {type: 'color', default: '#FFFF00'},
	    scale: {type: 'number', default: 2 },
	    side: {type: 'string', default: "front" },
	  },
	  init: function () {
	    var scene = this.el.sceneEl.object3D;
	    var that = this;
	    var run = function() {
	      var camera = document.querySelector('[camera]').object3D;
	      that.camera = camera;

	      var sideRender = THREE.FrontSide;
	      if (that.data.side === "back") {
	        sideRender = THREE.BackSide;
	      }

	      // Setup shader
	    	that.glowMaterial = new THREE.ShaderMaterial({
	    	    uniforms: {
	    			"c":   { type: "f", value: that.data.c },
	    			"p":   { type: "f", value: that.data.p },
	    			glowColor: { type: "c", value: new THREE.Color(that.data.color) },
	    			viewVector: { type: "v3", value: camera.position }
	    		},
	    		vertexShader:   THREE.__GlowShader.vertexShader,
	    		fragmentShader: THREE.__GlowShader.fragmentShader,
	    		side: sideRender,
	    		blending: THREE.AdditiveBlending,
	    		transparent: true
	    	});

	      // ISSUE for OBJs: >> line below
	      var object = that.el.object3DMap.mesh.geometry.clone();
	      object = new Geometry().fromBufferGeometry(object);
	      var modifier = new THREE.BufferSubdivisionModifier( 2 );
	      object = modifier.modify( object );

	      that.glowMesh = new THREE.Mesh( object, that.glowMaterial);
	    	that.el.object3D.add( that.glowMesh );

	      if (!that.data.enabled) {
	       that.glowMesh.visible = false;
	      }
	    }

	    // Make sure the entity has a mesh, otherwise wait for the 3D model to be loaded..
	    function waitForEntityLoad() {
	      if (that.el.object3DMap.mesh) { return run() }
	      that.el.addEventListener('model-loaded', run);
	    }

	    // Make sure the scene has been loaded..
	    if (this.el.sceneEl.hasLoaded) { return waitForEntityLoad(); }
	    this.el.sceneEl.addEventListener('loaded', waitForEntityLoad);
	  },
	  update: function () {
	    if (this.data.enabled) {
	      if (this.glowMesh) {
	        this.glowMesh.visible = true;

	        if (this.data.c < 0) { this.data.c = 0; }
	        if (this.data.c > 1) { this.data.c = 1; }
	        if (this.data.p < 0) { this.data.p = 0; }
	        if (this.data.p > 6) { this.data.p = 6; }

	        this.glowMesh.material.uniforms[ "c" ].value = this.data.c;
	        this.glowMesh.material.uniforms[ "p" ].value = this.data.p;
	        this.glowMesh.material.uniforms.glowColor.value.setHex( this.data.color.replace("#", "0x"));

	        var sideRender = THREE.FrontSide;
	        if (this.data.side === "back") {
	          sideRender = THREE.BackSide;
	        }
	        this.glowMesh.material.side = sideRender;
	      }
	    } else if (this.glowMesh) {
	      this.glowMesh.visible = false;
	    }
	  },
	  tick: function () {
	    if (this.glowMesh) {
	      this.glowMesh.rotation.set(this.el.object3D.rotation.x, this.el.object3D.rotation.y, this.el.object3D.rotation.z);
	      this.glowMesh.scale.set(this.el.object3D.scale.x*this.data.scale, this.el.object3D.scale.y*this.data.scale, this.el.object3D.scale.z*this.data.scale);
	      if (!this.camera) { return; }
	      this.glowMesh.material.uniforms.viewVector.value =
	    		new THREE.Vector3().subVectors( this.camera.position, this.glowMesh.position );
	    }
	  },
	  remove: function () {
	    if (!this.glowMesh) { return; }
	    var scene = this.el.sceneEl.object3D;
	    scene.remove( this.glowMesh );
	    this.glowMesh = null;
	    this.glowMaterial = null;
	  },
	  pause: function () {},
	  play: function () {}
	});


	THREE.__GlowShader = {

		vertexShader: [

	    "uniform vec3 viewVector;",
	    "uniform float c;",
	    "uniform float p;",
	    "varying float intensity;",
	    "void main() ",
	    "{",
	      "vec3 vNormal = normalize( normalMatrix * normal );",
	    	"vec3 vNormel = normalize( normalMatrix * viewVector );",
	    	"intensity = pow( c - dot(vNormal, vNormel), p );",

	      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	    "}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 glowColor;",
	    "varying float intensity;",
	    "void main() ",
	    "{",
	    	"vec3 glow = glowColor * intensity;",
	      "gl_FragColor = vec4( glow, 1.0 );",
	    "}"

		].join("\n")

	};




	/*
	 * @author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
	 * @author Matthew Adams / http://www.centerionware.com - added UV support and rewrote to use buffergeometry.
	 *
	 * Subdivision Geometry Modifier using Loop Subdivision Scheme for Geometry / BufferGeometry
	 *
	 * References:
	 *	http://graphics.stanford.edu/~mdfisher/subdivision.html
	 *	http://www.holmes3d.net/graphics/subdivision/
	 *	http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
	 *
	 * Known Issues:
	 *	- currently doesn't handle "Sharp Edges"
	 *	- no checks to prevent breaking when uv's don't exist.
	 *	- vertex colors are unsupported.
	 *	**DDS Images when using corrected uv's passed to subdivision modifier will have their uv's flipy'd within the correct uv set
	 *	**Either flipy the DDS image, or use shaders. Don't try correcting the uv's before passing into subdiv (eg: v=1-v).
	 *
	 * @input THREE.Geometry, or index'd THREE.BufferGeometry with faceUV's (Not vertex uv's)
	 * @output non-indexed vertex points, uv's, normals.
	 *
	 * The TypedArrayHelper class is designed to assist managing typed arrays, and to allow the removal of all 'new Vector3, new Face3, new Vector2'.
	 *
	 * It will automatically resize them if trying to push a new element to an array that isn't long enough
	 * It provides 'registers' that the units can be mapped to. This allows a small set of objects
	 * (ex: vector3's, face3's, vector2's) to be allocated then used, to eliminate any need to rewrite all
	 * the features those classes offer while not requiring some_huge_number to be allocated.
	 * It should be moved into it's own file honestly, then included before the BufferSubdivisionModifier - maybe in three's core?
	 *
	 */

	THREE.Face3.prototype.set = function( a, b, c ) {

		this.a = a;
		this.b = b;
		this.c = c;

	};

	var TypedArrayHelper = function( size, registers, register_type, array_type, unit_size, accessors ) {

		this.array_type = array_type;
		this.register_type = register_type;
		this.unit_size = unit_size;
		this.accessors = accessors;
		this.buffer = new array_type( size * unit_size );
		this.register = [];
		this.length = 0;
		this.real_length = size;
		this.available_registers = registers;

		for ( var i = 0; i < registers; i++ ) {

			this.register.push( new register_type() );

		}

	};

	TypedArrayHelper.prototype = {

		constructor: TypedArrayHelper,

		index_to_register: function( index, register, isLoop ) {

			var base = index * this.unit_size;

			if ( register >= this.available_registers ) {

				throw new Error( 'THREE.BufferSubdivisionModifier: Not enough registers in TypedArrayHelper.' );

			}

			if ( index > this.length ) {

				throw new Error( 'THREE.BufferSubdivisionModifier: Index is out of range in TypedArrayHelper.' );

			}

			for ( var i = 0; i < this.unit_size; i++ ) {

				( this.register[ register ] )[ this.accessors[ i ] ] = this.buffer[ base + i ];

			}

		},

		resize: function( new_size ) {

			if ( new_size === 0 ) {

				new_size = 8;

			}

			if ( new_size < this.length ) {

				this.buffer = this.buffer.subarray( 0, this.length * this.unit_size );

			} else {

				var nBuffer;

				if ( this.buffer.length < new_size * this.unit_size ) {

					nBuffer = new this.array_type( new_size * this.unit_size );
					nBuffer.set( this.buffer );
					this.buffer = nBuffer;
					this.real_length = new_size;

				} else {

					nBuffer = new this.array_type( new_size * this.unit_size );
					nBuffer.set( this.buffer.subarray( 0, this.length * this.unit_size ) );
					this.buffer = nBuffer;
					this.real_length = new_size;

				}

			}

		},

		from_existing: function( oldArray ) {

			var new_size = oldArray.length;
			this.buffer = new this.array_type( new_size );
			this.buffer.set( oldArray );
			this.length = oldArray.length / this.unit_size;
			this.real_length = this.length;

		},

		push_element: function( vector ) {

			if ( this.length + 1 > this.real_length ) {

				this.resize( this.real_length * 2 );

			}

			var bpos = this.length * this.unit_size;

			for ( var i = 0; i < this.unit_size; i++ ) {

				this.buffer[ bpos + i ] = vector[ this.accessors[ i ] ];

			}

			this.length++;

		},

		trim_size: function() {

			if ( this.length < this.real_length ) {

				this.resize( this.length );

			}

		}

	};


	function convertGeometryToIndexedBuffer( geometry ) {

		var BGeom = new THREE.BufferGeometry();

		// create a new typed array
		var vertArray = new TypedArrayHelper( geometry.vertices.length, 0, THREE.Vector3, Float32Array, 3, [ 'x', 'y', 'z' ] );
		var indexArray = new TypedArrayHelper( geometry.faces.length, 0, THREE.Face3, Uint32Array, 3, [ 'a', 'b', 'c' ] );
		var uvArray = new TypedArrayHelper( geometry.faceVertexUvs[0].length * 3 * 3, 0, THREE.Vector2, Float32Array, 2, [ 'x', 'y' ] );

		for ( var i = 0, il = geometry.vertices.length; i < il; i++ ) {

			vertArray.push_element( geometry.vertices[ i ] );

		}

		for ( var i = 0, il = geometry.faces.length; i < il; i++ ) {

			indexArray.push_element( geometry.faces[ i ] );

		}

		for ( var i = 0, il = geometry.faceVertexUvs[ 0 ].length; i < il; i++ ) {

			uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 0 ] );
			uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 1 ] );
			uvArray.push_element( geometry.faceVertexUvs[ 0 ][ i ][ 2 ] );

		}

		indexArray.trim_size();
		vertArray.trim_size();
		uvArray.trim_size();

		BGeom.setIndex( new THREE.BufferAttribute( indexArray.buffer, 3 ) );
		BGeom.setAttribute( 'position', new THREE.BufferAttribute( vertArray.buffer, 3 ) );
		BGeom.setAttribute( 'uv', new THREE.BufferAttribute( uvArray.buffer, 2 ) );

		return BGeom;

	}

	function compute_vertex_normals( geometry ) {

		var ABC = [ 'a', 'b', 'c' ];
		var XYZ = [ 'x', 'y', 'z' ];
		var XY = [ 'x', 'y' ];

		var oldVertices = new TypedArrayHelper( 0, 5, THREE.Vector3, Float32Array, 3, XYZ );
		var oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
		oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
		var newNormals = new TypedArrayHelper( oldVertices.length * 3, 4, THREE.Vector3, Float32Array, 3, XYZ );
		var newNormalFaces = new TypedArrayHelper( oldVertices.length, 1, function () { this.x = 0; }, Float32Array, 1, [ 'x' ] );

		newNormals.length = oldVertices.length;
		oldFaces.from_existing( geometry.index.array );
		var a, b, c;
		var my_weight;
		var full_weights = [ 0.0, 0.0, 0.0 ];

		for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

			oldFaces.index_to_register( i, 0 );

			oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

			newNormals.register[ 0 ].subVectors( oldVertices.register[ 1 ], oldVertices.register[ 0 ] );
			newNormals.register[ 1 ].subVectors( oldVertices.register[ 2 ], oldVertices.register[ 1 ] );
			newNormals.register[ 0 ].cross( newNormals.register[ 1 ] );
			my_weight = Math.abs( newNormals.register[ 0 ].length() );

			newNormalFaces.buffer[ oldFaces.register[ 0 ].a ] += my_weight;
			newNormalFaces.buffer[ oldFaces.register[ 0 ].b ] += my_weight;
			newNormalFaces.buffer[ oldFaces.register[ 0 ].c ] += my_weight;

		}

		var t_len;

		for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

			oldFaces.index_to_register( i, 0 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

			newNormals.register[ 0 ].subVectors( oldVertices.register[ 1 ], oldVertices.register[ 0 ] );
			newNormals.register[ 1 ].subVectors( oldVertices.register[ 2 ], oldVertices.register[ 0 ] );

			newNormals.register[ 3 ].set( 0, 0, 0 );
			newNormals.register[ 3 ].x = ( newNormals.register[ 0 ].y * newNormals.register[ 1 ].z ) - ( newNormals.register[ 0 ].z * newNormals.register[ 1 ].y );
			newNormals.register[ 3 ].y = ( newNormals.register[ 0 ].z * newNormals.register[ 1 ].x ) - ( newNormals.register[ 0 ].x * newNormals.register[ 1 ].z );
			newNormals.register[ 3 ].z = ( newNormals.register[ 0 ].x * newNormals.register[ 1 ].y ) - ( newNormals.register[ 0 ].y * newNormals.register[ 1 ].x );

			newNormals.register[ 0 ].cross( newNormals.register[ 1 ] );

			my_weight = Math.abs( newNormals.register[ 0 ].length() );

			full_weights[ 0 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].a ] );
			full_weights[ 1 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].b ] );
			full_weights[ 2 ] = ( my_weight / newNormalFaces.buffer[ oldFaces.register[ 0 ].c ] );

			newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 0 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 0 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].a * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 0 ];

			newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 1 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 1 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].b * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 1 ];

			newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 0 ] += newNormals.register[ 3 ].x * full_weights[ 2 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 1 ] += newNormals.register[ 3 ].y * full_weights[ 2 ];
			newNormals.buffer[ ( oldFaces.register[ 0 ].c * 3 ) + 2 ] += newNormals.register[ 3 ].z * full_weights[ 2 ];

		}

		newNormals.trim_size();
		geometry.setAttribute( 'normal', new THREE.BufferAttribute( newNormals.buffer, 3 ) );

	}

	function unIndexIndexedGeometry( geometry ) {

		var ABC = [ 'a', 'b', 'c' ];
		var XYZ = [ 'x', 'y', 'z' ];
		var XY = [ 'x', 'y' ];

		var oldVertices = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );
		var oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
		var oldUvs = new TypedArrayHelper( 0, 3, THREE.Vector2, Float32Array, 2, XY );
		var oldNormals = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );

		oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
		oldFaces.from_existing( geometry.index.array );
		oldUvs.from_existing( geometry.getAttribute( 'uv' ).array );

		compute_vertex_normals( geometry );
		oldNormals.from_existing( geometry.getAttribute( 'normal' ).array );

		var newVertices = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector3, Float32Array, 3, XYZ );
		var newNormals = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector3, Float32Array, 3, XYZ );
		var newUvs = new TypedArrayHelper( oldFaces.length * 3, 3, THREE.Vector2, Float32Array, 2, XY );
		var v, w;

		for ( var i = 0, il = oldFaces.length; i < il; i++ ) {

			oldFaces.index_to_register( i, 0 );

			oldVertices.index_to_register( oldFaces.register[ 0 ].a, 0 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].b, 1 );
			oldVertices.index_to_register( oldFaces.register[ 0 ].c, 2 );

			newVertices.push_element( oldVertices.register[ 0 ] );
			newVertices.push_element( oldVertices.register[ 1 ] );
			newVertices.push_element( oldVertices.register[ 2 ] );

				if ( oldUvs.length !== 0 ) {

					oldUvs.index_to_register( ( i * 3 ) + 0, 0 );
					oldUvs.index_to_register( ( i * 3 ) + 1, 1 );
					oldUvs.index_to_register( ( i * 3 ) + 2, 2 );

					newUvs.push_element( oldUvs.register[ 0 ] );
					newUvs.push_element( oldUvs.register[ 1 ] );
					newUvs.push_element( oldUvs.register[ 2 ] );

				}

			oldNormals.index_to_register( oldFaces.register[ 0 ].a, 0 );
			oldNormals.index_to_register( oldFaces.register[ 0 ].b, 1 );
			oldNormals.index_to_register( oldFaces.register[ 0 ].c, 2 );

			newNormals.push_element( oldNormals.register[ 0 ] );
			newNormals.push_element( oldNormals.register[ 1 ] );
			newNormals.push_element( oldNormals.register[ 2 ] );

		}

		newVertices.trim_size();
		newUvs.trim_size();
		newNormals.trim_size();

		geometry.index = null;

		geometry.setAttribute( 'position', new THREE.BufferAttribute( newVertices.buffer, 3 ) );
		geometry.setAttribute( 'normal', new THREE.BufferAttribute( newNormals.buffer, 3 ) );

		if ( newUvs.length !== 0 ) {

			geometry.setAttribute( 'uv', new THREE.BufferAttribute( newUvs.buffer, 2 ) );

		}

		return geometry;

	}

	THREE.BufferSubdivisionModifier = function( subdivisions ) {

		this.subdivisions = ( subdivisions === undefined ) ? 1 : subdivisions;

	};

	THREE.BufferSubdivisionModifier.prototype.modify = function( geometry ) {

		if ( geometry instanceof Geometry ) {

			geometry.mergeVertices();

			if ( typeof geometry.normals === 'undefined' ) {

				geometry.normals = [];

			}

			geometry = convertGeometryToIndexedBuffer( geometry );

		} else if ( !( geometry instanceof THREE.BufferGeometry ) ) {

			console.error( 'THREE.BufferSubdivisionModifier: Geometry is not an instance of THREE.BufferGeometry or THREE.Geometry' );

		}

		var repeats = this.subdivisions;

		while ( repeats -- > 0 ) {

			this.smooth( geometry );

		}

		return unIndexIndexedGeometry( geometry );

	};

	var edge_type = function ( a, b ) {

		this.a = a;
		this.b = b;
		this.faces = [];
		this.newEdge = null;

	};

	( function () {

		// Some constants
		var ABC = [ 'a', 'b', 'c' ];
		var XYZ = [ 'x', 'y', 'z' ];
		var XY = [ 'x', 'y' ];

		function getEdge( a, b, map ) {

			var key = Math.min( a, b ) + '_' + Math.max( a, b );
			return map[ key ];

		}


		function processEdge( a, b, vertices, map, face, metaVertices ) {

			var vertexIndexA = Math.min( a, b );
			var vertexIndexB = Math.max( a, b );

			var key = vertexIndexA + '_' + vertexIndexB;

			var edge;

			if ( key in map ) {

				edge = map[ key ];

			} else {

				edge = new edge_type( vertexIndexA,vertexIndexB );
				map[key] = edge;

			}

			edge.faces.push( face );

			metaVertices[ a ].edges.push( edge );
			metaVertices[ b ].edges.push( edge );

		}

		function generateLookups( vertices, faces, metaVertices, edges ) {

			var i, il, face, edge;

			for ( i = 0, il = vertices.length; i < il; i++ ) {

				metaVertices[ i ] = { edges: [] };

			}

			for ( i = 0, il = faces.length; i < il; i++ ) {

				faces.index_to_register( i, 0 );
				face = faces.register[ 0 ]; // Faces is now a TypedArrayHelper class, not a face3.

				processEdge( face.a, face.b, vertices, edges, i, metaVertices );
				processEdge( face.b, face.c, vertices, edges, i, metaVertices );
				processEdge( face.c, face.a, vertices, edges, i, metaVertices );

			}

		}

		function newFace( newFaces, face ) {

			newFaces.push_element( face );

		}

		function midpoint( a, b ) {

			return ( Math.abs( b - a ) / 2 ) + Math.min( a, b );

		}

		function newUv( newUvs, a, b, c ) {

			newUvs.push_element( a );
			newUvs.push_element( b );
			newUvs.push_element( c );

		}

		/////////////////////////////

		// Performs one iteration of Subdivision

		THREE.BufferSubdivisionModifier.prototype.smooth = function ( geometry ) {

			var oldVertices, oldFaces, oldUvs;
			var newVertices, newFaces, newUVs;

			var n, l, i, il, j, k;
			var metaVertices, sourceEdges;

			oldVertices = new TypedArrayHelper( 0, 3, THREE.Vector3, Float32Array, 3, XYZ );
			oldFaces = new TypedArrayHelper( 0, 3, THREE.Face3, Uint32Array, 3, ABC );
			oldUvs = new TypedArrayHelper( 0, 3, THREE.Vector2, Float32Array, 2, XY );
			oldVertices.from_existing( geometry.getAttribute( 'position' ).array );
			oldFaces.from_existing( geometry.index.array );
			oldUvs.from_existing( geometry.getAttribute( 'uv' ).array );

			var doUvs = false;

			if ( typeof oldUvs !== 'undefined' && oldUvs.length !== 0 ) {

				doUvs = true;

			}
			/******************************************************
			*
			* Step 0: Preprocess Geometry to Generate edges Lookup
			*
			*******************************************************/

			metaVertices = new Array( oldVertices.length );
			sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

			generateLookups( oldVertices, oldFaces, metaVertices, sourceEdges );


			/******************************************************
			*
			*	Step 1.
			*	For each edge, create a new Edge Vertex,
			*	then position it.
			*
			*******************************************************/

			newVertices = new TypedArrayHelper( ( geometry.getAttribute( 'position' ).array.length * 2 ) / 3, 2, THREE.Vector3, Float32Array, 3, XYZ );
			var other, currentEdge, newEdge, face;
			var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

			var tmp = newVertices.register[ 1 ];
			for ( i in sourceEdges ) {

			currentEdge = sourceEdges[ i ];
			newEdge = newVertices.register[ 0 ];

			edgeVertexWeight = 3 / 8;
			adjacentVertexWeight = 1 / 8;

			connectedFaces = currentEdge.faces.length;

			// check how many linked faces. 2 should be correct.
			if ( connectedFaces !== 2 ) {

				// if length is not 2, handle condition
				edgeVertexWeight = 0.5;
				adjacentVertexWeight = 0;

			}

			oldVertices.index_to_register( currentEdge.a, 0 );
			oldVertices.index_to_register( currentEdge.b, 1 );
			newEdge.addVectors( oldVertices.register[ 0 ], oldVertices.register[ 1 ] ).multiplyScalar( edgeVertexWeight );

			tmp.set( 0, 0, 0 );

			for ( j = 0; j < connectedFaces; j++ ) {

				oldFaces.index_to_register( currentEdge.faces[ j ], 0 );
				face = oldFaces.register[ 0 ];

				for ( k = 0; k < 3; k++ ) {

					oldVertices.index_to_register( face[ ABC[ k ] ], 2 );
					other = oldVertices.register[ 2 ];

					if ( face[ ABC[ k ] ] !== currentEdge.a && face[ ABC[ k ] ] !== currentEdge.b) {

						break;

					}

			}

			tmp.add( other );

			}

			tmp.multiplyScalar( adjacentVertexWeight );
			newEdge.add( tmp );

			currentEdge.newEdge = newVertices.length;
			newVertices.push_element( newEdge );

			}

			var edgeLength = newVertices.length;
			/******************************************************
			*
			*	Step 2.
			*	Reposition each source vertices.
			*
			*******************************************************/

			var beta, sourceVertexWeight, connectingVertexWeight;
			var connectingEdge, connectingEdges, oldVertex, newSourceVertex;

			for ( i = 0, il = oldVertices.length; i < il; i++ ) {

				oldVertices.index_to_register( i, 0, XYZ );
				oldVertex = oldVertices.register[ 0 ];

				// find all connecting edges (using lookupTable)
				connectingEdges = metaVertices[ i ].edges;
				n = connectingEdges.length;

				if ( n === 3 ) {

					beta = 3 / 16;

				} else if (n > 3) {

					beta = 3 / (8 * n); // Warren's modified formula

				}

				// Loop's original beta formula
				// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

				sourceVertexWeight = 1 - n * beta;
				connectingVertexWeight = beta;

				if ( n <= 2 ) {

					// crease and boundary rules

					if ( n === 2 ) {

						sourceVertexWeight = 3 / 4;
						connectingVertexWeight = 1 / 8;

					}

				}

				newSourceVertex = oldVertex.multiplyScalar( sourceVertexWeight );

				tmp.set( 0, 0, 0 );

				for ( j = 0; j < n; j++ ) {

					connectingEdge = connectingEdges[ j ];
					other = connectingEdge.a !== i ? connectingEdge.a : connectingEdge.b;
					oldVertices.index_to_register( other, 1, XYZ );
					tmp.add( oldVertices.register[ 1 ] );

				}

				tmp.multiplyScalar( connectingVertexWeight );
				newSourceVertex.add( tmp );

				newVertices.push_element( newSourceVertex,XYZ );

			}


			/******************************************************
			*
			*	Step 3.
			*	Generate faces between source vertices and edge vertices.
			*
			*******************************************************/


			var edge1, edge2, edge3;
			newFaces = new TypedArrayHelper( ( geometry.index.array.length * 4 ) / 3, 1, THREE.Face3, Float32Array, 3, ABC );
			newUVs = new TypedArrayHelper( ( geometry.getAttribute( 'uv' ).array.length * 4 ) / 2, 3, THREE.Vector2, Float32Array, 2, XY );
			var x3 = newUVs.register[ 0 ];
			var x4 = newUVs.register[ 1 ];
			var x5 = newUVs.register[ 2 ];
			var tFace = newFaces.register[ 0 ];

			for ( i = 0, il = oldFaces.length; i < il; i++ ) {

				oldFaces.index_to_register( i, 0 );
				face = oldFaces.register[ 0 ];

				// find the 3 new edges vertex of each old face
				// The new source verts are added after the new edge verts now..

				edge1 = getEdge( face.a, face.b, sourceEdges ).newEdge;
				edge2 = getEdge( face.b, face.c, sourceEdges ).newEdge;
				edge3 = getEdge( face.c, face.a, sourceEdges ).newEdge;

				// create 4 faces.
				tFace.set( edge1, edge2, edge3 );
				newFace( newFaces, tFace );
				tFace.set( face.a + edgeLength, edge1, edge3 );
				newFace( newFaces, tFace );
				tFace.set( face.b + edgeLength, edge2, edge1 );
				newFace( newFaces, tFace );
				tFace.set( face.c + edgeLength, edge3, edge2 );
				newFace( newFaces, tFace );


				/*
					0________C_______2
					 \      /\      /
					  \ F2 /  \ F4 /
					   \  / F1 \  /
					    \/______\/
					   A \      / B
					      \ F3 /
					       \  /
					        \/
					         1

					Draw orders:
					F1: ABC x3,x4,x5
					F2: 0AC x0,x3,x5
					F3: 1BA x1,x4,x3
					F4: 2CB x2,x5,x4

					0: x0
					1: x1
					2: x2
					A: x3
					B: x4
					C: x5
				*/

				if ( doUvs === true ) {

					oldUvs.index_to_register( ( i * 3 ) + 0, 0 );
					oldUvs.index_to_register( ( i * 3 ) + 1, 1 );
					oldUvs.index_to_register( ( i * 3 ) + 2, 2 );

					var x0 = oldUvs.register[ 0 ]; // uv[0];
					var x1 = oldUvs.register[ 1 ]; // uv[1];
					var x2 = oldUvs.register[ 2 ]; // uv[2];

					x3.set( midpoint( x0.x, x1.x ), midpoint( x0.y, x1.y ) );
					x4.set( midpoint( x1.x, x2.x ), midpoint( x1.y, x2.y ) );
					x5.set( midpoint( x0.x, x2.x ), midpoint( x0.y, x2.y ) );

					newUv( newUVs, x3, x4, x5 );
					newUv( newUVs, x0, x3, x5 );

					newUv( newUVs, x1, x4, x3 );
					newUv( newUVs, x2, x5, x4 );

				}

			}

			// Overwrite old arrays

			newFaces.trim_size();
			newVertices.trim_size();
			newUVs.trim_size();

			geometry.setIndex( new THREE.BufferAttribute( newFaces.buffer ,3 ) );
			geometry.setAttribute( 'position', new THREE.BufferAttribute( newVertices.buffer, 3 ) );
			geometry.setAttribute( 'uv', new THREE.BufferAttribute( newUVs.buffer, 2 ) );

		};

	} ) ();


/***/ })
/******/ ]);
