function someFun() {
    var x = 'j';
    wow.bind(this)();
}

function wow() {
  console.log(this.x);
}
