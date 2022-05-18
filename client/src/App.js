import { useState, useEffect, useRef } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [foodName, setFoodName] = useState("");
  const [weight, setWeight] = useState(0);
  const [newFoodName, setNewFoodName] = useState([]);
  // const [newWeight, setNewWeight] = useState(0);
  const [fruitNameChanged, setFruitNameChanged] = useState(false);

  const [updatedFoodName, setUpdatedFoodName] = useState({});

  const [foodList, setFoodList] = useState([]);

  const currentItem = useRef();
  const arrIndex = useRef([]);
  arrIndex.current = [];

  useEffect(() => {
    Axios.get("http://localhost:3001/read").then((response) => {
      setFoodList(response.data);
      let tempArr = {};
      response.data.map((i, c) => {
        tempArr[i._id] = "";
        console.log(i, c);
        if (c + 1 === response.data.length) {
          setUpdatedFoodName(tempArr);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (fruitNameChanged) {
      Axios.get("http://localhost:3001/read").then((response) => {
        setFoodList(response.data);
      });
      setFruitNameChanged(false);
    }
  }, [fruitNameChanged]);

  // const onChange = (e) => {
  //   setFoodName(e.target.value);
  // };

  // const changeFunc = (e) => {
  //   if (test) {
  //     setNewFoodName("");
  //   }
  //   if (!test) {
  //     setNewFoodName(e.target.value);
  //   }
  // };

  const addToList = () => {
    Axios.post("http://localhost:3001/insert", {
      foodName: foodName,
      weight: weight,
    });
    setFoodName("");
    setWeight(0);
    setFruitNameChanged(true);
  };

  const updateFood = (id) => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      newFoodName: newFoodName,
      // newWeight: newWeight,
    });
    let tempArr = { ...updatedFoodName };
    tempArr[id] = "";

    setUpdatedFoodName(tempArr);
    setFruitNameChanged(true);
    setNewFoodName("");

    const elem = currentItem.current;
    // elem.value = "";
    console.log(elem.value);

    // foodList.map((ele, id) => {
    //   console.log(ele);
    // });
  };

  const deleteFood = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`);
    setFruitNameChanged(true);
  };

  // let valu;
  // if (test == true) {
  //   valu = "";
  // } else if (test == false) {
  // }

  const addToRefs = (elem) => {
    if (elem && !arrIndex.current.includes(elem)) {
      arrIndex.current.push(elem);
    }
  };

  return (
    <div className="outerContainer">
      <div className="innerContainer">
        <div className="upperDiv">
          <h1>CRUD App in MERN</h1>
          <div>
            <label className="m-5" htmlFor="">
              Food Name :{" "}
            </label>
            <input
              className="m-5"
              type="text"
              id="name"
              onChange={(e) => {
                setFoodName(e.target.value);
              }}
              value={foodName}
            />
          </div>
          <div>
            <label htmlFor="" className="m-5">
              Weight :{" "}
            </label>
            <input
              className="m-5"
              type="number"
              name=""
              id="number"
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              value={weight}
            />
          </div>
          <button id="addButton" className="m-5" onClick={addToList}>
            Add to List
          </button>
        </div>
        <div className="line"></div>
        <br />
        <div className="lowerDiv">
          <h1>Food List</h1>
          {foodList.map((val, key) => {
            return (
              <div className="listItem mb-10" key={key} ref={addToRefs}>
                <div className="p-5">
                  <span className="name">{val.foodName}</span>
                  <span className="number">{val.weight}</span>
                </div>
                <div>
                  <input
                    className="change"
                    id="updateField"
                    type="text"
                    ref={currentItem}
                    value={updatedFoodName[val._id]}
                    placeholder="Change food name here..."
                    // onChange={changeFunc}
                    onChange={(e, key) => {
                      let tempArr = { ...updatedFoodName };
                      tempArr[val._id] = e.target.value;
                      setNewFoodName(e.target.value);
                      setUpdatedFoodName(tempArr);
                    }}
                  />
                  {/* <input
              type="text"
              placeholder="Change weight here..."
              onChange={(e) => {
                setNewWeight(e.target.value);
              }}
            /> */}

                  <button
                    className="update"
                    onClick={() => updateFood(val._id)}
                  >
                    Update
                  </button>
                </div>

                <button className="del" onClick={() => deleteFood(val._id)}>
                  Del
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
