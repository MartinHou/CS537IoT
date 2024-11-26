import React, { useState } from 'react';
import './App.css';

function App() {
  var [nutritionData, setNutritionData] = useState<any>(null);

  var handleRefresh = function () {
    // const mockData = {
    //   "consumed_items": [
    //     {
    //       "calories": 22,
    //       "carbohydrates": 5,
    //       "cholesterol": 0,
    //       "fat": 0.2,
    //       "fiber": 1.5,
    //       "name": "Tomato",
    //       "protein": 1,
    //       "sodium": 6,
    //       "sugar": 3
    //     },
    //     {
    //       "calories": 187,
    //       "carbohydrates": 24,
    //       "cholesterol": 58,
    //       "fat": 9,
    //       "fiber": 0.5,
    //       "name": "Sponge Cake",
    //       "protein": 3,
    //       "sodium": 120,
    //       "sugar": 15
    //     },
    //     {
    //       "calories": 140,
    //       "carbohydrates": 39,
    //       "cholesterol": 0,
    //       "fat": 0,
    //       "fiber": 0,
    //       "name": "Soda",
    //       "protein": 0,
    //       "sodium": 45,
    //       "sugar": 39
    //     }
    //   ],
    //   "total_nutrition": {
    //     "calories": 349,
    //     "carbohydrates": 68,
    //     "cholesterol": 58,
    //     "fat": 9.2,
    //     "fiber": 2,
    //     "protein": 4,
    //     "sodium": 171,
    //     "sugar": 57
    //   }
    // }
    // setNutritionData(mockData);
    // drawChart(mockData);

    fetch('http://127.0.0.1:5001/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image1: 'https://github.com/MartinHou/testcs537/blob/main/1.jpg?raw=true',
        image2: 'https://github.com/MartinHou/testcs537/blob/main/2.jpg?raw=true',
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function (data) {
        setNutritionData(data);
        drawChart(data);
      })
      .catch(function (error) {
        console.error('Error fetching data:', error);
      });
  };

  var drawChart = function (data: any) {
    if (data && data.total_nutrition) {
      var calories = data.total_nutrition.calories,
        carbohydrates = data.total_nutrition.carbohydrates,
        cholesterol = data.total_nutrition.cholesterol,
        fat = data.total_nutrition.fat,
        fiber = data.total_nutrition.fiber,
        protein = data.total_nutrition.protein,
        sodium = data.total_nutrition.sodium,
        sugar = data.total_nutrition.sugar;
      var canvas = document.getElementById('nutritionChart') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      var ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not found');
        return;
      }
      var total = calories + carbohydrates + cholesterol + fat + fiber + protein + sodium + sugar;

      var chartData = [calories, carbohydrates, cholesterol, fat, fiber, protein, sodium, sugar];
      var labels = ['Calories', 'Carbohydrates', 'Cholesterol', 'Fat', 'Fiber', 'Protein', 'Sodium', 'Sugar'];
      var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#F7464A'];

      var startAngle = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      chartData.forEach(function (value, index) {
        if (value <= 0) {
          return;
        }
        var sliceAngle = (value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.fillStyle = colors[index];
        ctx.moveTo(200, 150);
        ctx.arc(200, 150, 150, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        startAngle += sliceAngle;
      });

      // Draw labels
      var legendY = 20;
      labels.forEach(function (label, index) {
        ctx.fillStyle = colors[index];
        ctx.fillRect(370, legendY, 20, 20);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(label + ': ' + chartData[index], 400, legendY + 15);
        legendY += 30;
      });
    }
  };

  return (
    React.createElement("div", { className: "App" },
      React.createElement("header", { className: "App-header" },
        React.createElement("h1", null, "Lose weight everyday"),
        React.createElement("button", { onClick: handleRefresh, className: "App-button" }, "Refresh Nutrition Data"),
        React.createElement("canvas", { id: "nutritionChart", width: "600", height: "400" }),
        nutritionData && (
          React.createElement("table", { className: "App-table" },
            React.createElement("thead", null,
              React.createElement("tr", null,
                React.createElement("th", null, "Item"),
                React.createElement("th", null, "Calories"),
                React.createElement("th", null, "Carbohydrates"),
                React.createElement("th", null, "Cholesterol"),
                React.createElement("th", null, "Fat"),
                React.createElement("th", null, "Fiber"),
                React.createElement("th", null, "Protein"),
                React.createElement("th", null, "Sodium"),
                React.createElement("th", null, "Sugar")
              )
            ),
            React.createElement("tbody", null,
              Array.isArray(nutritionData.consumed_items) && nutritionData.consumed_items.map(function (item: any, index: number) {
                return React.createElement("tr", { key: index },
                  React.createElement("td", null, item.name),
                  React.createElement("td", null, item.calories),
                  React.createElement("td", null, item.carbohydrates),
                  React.createElement("td", null, item.cholesterol),
                  React.createElement("td", null, item.fat),
                  React.createElement("td", null, item.fiber),
                  React.createElement("td", null, item.protein),
                  React.createElement("td", null, item.sodium),
                  React.createElement("td", null, item.sugar)
                );
              })
            )
          )
        )
      )
    )
  );
}

export default App;
