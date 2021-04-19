app.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    Student.remove({_id:id},(err,result)=>{
        if(err)
        {
            console.log(err);
            res.status(500).send('error occured');
        }
        else{
            res.status(200).json({msg:"successfully deleted"});
        }
    })
})
app.put('/student/:id',(req,res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const place = req.body.place;
    const id = req.params.id;
    Student.update({_id:id},{$set:{firstname:firstname,lastname:lastname,place:place}})
    .then(result=>{
        console.log(result);
        res.status(200).json({msg:"successfully updated"});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({msg:"error occurred"});
    })
})
