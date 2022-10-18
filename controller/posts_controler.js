const getPost = (req, res, next) => {
  res.status(200).json({
    title: "hello ",
    likes: 10,
    comments: [{ userId: 324324324, comment:"hai guys" }],
  });
};


module.exports ={
    getPost
}