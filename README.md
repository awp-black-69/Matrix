Matrix
======

Library for matrix operations like determinant, inverse, adjoint etc


###Usage

**Creating new matrix**

```javascript
var mat = Matrix.create( [ [1,5,2], [5,2,7], [22, 645, 6] ] );
```

**Assign new matrix**

```mat.set( [ [1,7,3], [8,3,67], [33,6,1] ] )``` Return type: ***null***

**Determinant**

```mat.determinent()``` Returns determinant of matrix, mat. Return type : **int**

**Get ith row**

```mat.row(i);``` Returns array containing ith row. Return type: **Array**

**Get element at ith row and jth column**

```mat.at(i, j);``` Returns *null* if none found. Return type: **int**

**Print matrix**

```mat.print(*optional* HTMLElement)``` Prints matrix as innerHTML if HTMLElement is provided else print in console. Return type: ***null***


**Inverse**

```mat.inverse()``` Return new instance of matrix containing inverse of the matrix, mat. Return type: ***Matrix***

Throws error if matrix is non-invertible.

**Adjoint**

```mat.adjoint()``` Return new instance of matrix containing adjoint of the matrix, mat. Return type: ***Matrix***

**Transpose**

```mat.transpose()``` Return new instance of matrix containing transpose of the matrix, mat. Return type: ***Matrix***

**Multiply**

```mat.multiply(*factor*)``` Return new instance of matrix after multiplying each element of matrix, mat, with factor provided. Return type: ***Matrix***


**Divide**

```mat.divide(*factor*)``` Return new instance of matrix after dividing each element of matrix, mat, with factor provided. Return type: ***Matrix***

Throws error if *factor* provided is zero(0).
