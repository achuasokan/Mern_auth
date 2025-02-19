

export const Home = async(req,res) => {
  try {
    res.json('Home')
  } catch(error) {
    console.log(error);
    res.status(500).send('Internal server error')
  }
}