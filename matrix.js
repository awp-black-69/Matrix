(function(w){

	var errors = {
			OBJ_NOT_ARRAY: "Object is not instanceof Array.",
			MALFORMED_ARRAY: "Malformed array provided.",
			INVALIDE_MATRIX: "'multiplication' accepts two matrix as parameter.",
			NON_SQUARE_MATRIX: "Non-square matrix.",
			NAN: "Not a number (NaN).",
			DIV_BY_0: "Division by zero.",
			NON_INVERT: "Non invertible matrix."
		},
		mat = {
			validate: function(obj){
				var i = obj.length, col;
				
				if(!obj instanceof Array) {
					return {
						error: 1,
						message: errors.OBJ_NOT_ARRAY
					};
				}

				if(!i) return {error: 0};

				col = obj[--i].length;
				while(i-- && col != obj[i].length) return {error: 2, message: errors.MALFORMED_ARRAY};

				return {error: 0};
			},
			create: function(args){
				return new M(args);
			},
			multiply: function(m1, m2){
				if(!m1 instanceof M || !m2 instanceof M) {
					throw new Error(errors.INVALIDE_MATRIX);
				}
			}
		},
		pri = {
			newElem: function(tag){
				return document.createElement(tag);
			},
			clone: function(obj){
				return JSON.parse(JSON.stringify(obj));
			},
			subMatrix: function(rows, i, j){
				var r = pri.clone(rows),
					index;

				r.splice(i,1);
				index = r.length;
				while(index--) r[index].splice(j, 1);

				return r;
			},
			isSquare: function(rows){
				if(rows.length === 0) return true;
				if(!rows || rows.length === undefined) return false;

				return rows.length === rows[0].length;
			},
			evalDeterminant: function(rows){
				var r = rows, lR, lC, i, j, sum, sign, temp = '';

				if(r.length == 0)
					return 0;
				if(r.length == 1)
					return r[0][0];
				if(r.length == 2)
					return ( (r[0][0] * r[1][1]) - (r[0][1] * r[1][0]) );

				lR = r.length;
				lC = r[0].length;
				sum = 0;

				for(i = 0; i < 1; i++) {
					for(j=0; j < lC; j++) {
						sign = ((i+j)%2) ? -1 : 1;
						sum += (sign * r[i][j] * pri.evalDeterminant(pri.subMatrix(rows, i, j) ) );
					}
				}

				return sum;
			},
			evalTranspose: function(rows){
				var r = pri.clone(rows), i, j, temp;


				for (i = 0; i < r.length; i++)
					for (j = 0; j < r.length; j++) {
						if(i >= j) continue;
						temp = r[i][j];
						r[i][j] = r[j][i];
						r[j][i] = temp;
					}

				return (r);
			},
			evalAdjoint: function(rows){
				var r = pri.clone(rows), i, j, adj = [], sign;

				i = r.length;
				while(i--) adj.push(new Array(r.length));
				for(i=0; i<r.length; i++)
					for(j=0; j<r.length; j++) {
						sign = ((i+j)%2) ? -1 : 1;
						adj[i][j] = sign * pri.evalDeterminant(
												pri.subMatrix(r, i, j)
											);
					}

				return pri.evalTranspose(adj);
			},
			scale: function(rows, fac, isDivision){
				var r = pri.clone(rows), lR, lC;

				fac = parseInt(fac);
				if(isNaN(fac)) throw new Error(error.NAN);

				lR = r.length;
				lC = r[0] ? r[0].length : 0;
				for(i=0; i<lR; i++)
					for(j=0; j<lC; j++) {
						if(isDivision)
							r[i][j] /= fac;
						else
							r[i][j] *= fac;
					}

				return r;
			}
		};

	var M = function(){
		this.set.apply(this, arguments);
	};
	M.prototype.set = function(obj){
		var err;

		if((err = mat.validate(obj)).error) {
			throw new Error(err.message);
		}

		this.rowLength = obj.length;
		this.colLength = this.rowLength ? obj.length : 0;
		this.rows = obj;
	};
	M.prototype.row = function(i){
		return this.rows[i];
	};
	M.prototype.at = function(i, j){
		return (this.rows[i] && this.rows[i][j]) ? this.rows[i][j] : null;
	};
	M.prototype.print = function(toElement){
		var newLine = '\n\r', newTab = '\t', i, j, trow, str = '';

		if(!toElement || !toElement.nodeType) toElement = null;

		if(toElement){
			newLine = '<br>';
			newTab = '&#9;';
		}

		for(i=0; i<this.rows.length; i++) {
			i && (str += newLine);
			for(j=0; j<this.rows[i].length; j++) {
				j && (str += newTab);
				str += this.rows[i][j].toString();
			}
		}

		if(toElement)
			toElement.innerHTML = str;
		else
			console.log(str);
	};
	M.prototype.inverse = function(){
		var det = pri.evalDeterminant(this.rows), adj;

		if(det == 0) throw new Error(errors.NON_INVERT);

		adj = pri.evalAdjoint(this.rows);

		return mat.create(pri.scale(adj, det, true));
	};
	M.prototype.determinent = function(){
		var errs;

		if(!pri.isSquare(this.rows)) {
			throw new Error(errors.NON_SQUARE_MATRIX);
		}
		errs = mat.validate(this.rows);
		if(errs.error) {
			throw new Error(errs.message);
		}

		return pri.evalDeterminant(this.rows);
	};
	M.prototype.adjoint = function(){
		if(!pri.isSquare(this.rows)) {
			throw new Error(errors.NON_SQUARE_MATRIX);
		}
		errs = mat.validate(this.rows);
		if(errs.error) {
			throw new Error(errs.message);
		}

		return new mat.create(pri.evalAdjoint(this.rows));
	};
	M.prototype.transpose = function(){
		if(!pri.isSquare(this.rows)) {
			throw new Error(errors.NON_SQUARE_MATRIX);
		}
		errs = mat.validate(this.rows);
		if(errs.error) {
			throw new Error(errs.message);
		}

		return new mat.create(pri.evalTranspose(this.rows));
	};
	M.prototype.multiply = function(mul){
		return mat.create(pri.scale(this.rows, mul));
	};
	M.prototype.divide = function(div){
		if(div == 0) throw new Error(error.DIV_BY_0);
		return mat.create(pri.scale(this.rows, div, true));
	};

	w.Matrix = mat;
})(window);