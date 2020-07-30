$('input').eq(0).on('blur',()=>{
    let name=$('input').eq(0).val();
    // alert(name)
    if(name==''){
        alert('用户名不能为空！');
    }
})
$('input').eq(1).on('blur',()=>{
    let password=$('input').eq(1).val();
    if(password==''){
        alert('密码不能为空！');
    }
})