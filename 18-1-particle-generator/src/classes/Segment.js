import * as THREE from 'three'
 
class Segment {
  a = null;
  b = null;

  constructor(a_, b_) {
    this.a = a_.clone();
    this.b = b_.clone();
  } 

  generate(v1, v2) {
    const segments = new Array(4).fill(new Segment(v1, v2));
  }
};

export default Segment;