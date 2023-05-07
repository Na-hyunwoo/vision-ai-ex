import { useEffect, useState } from "react";

export default function Image() {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const imageUrl = 'receipt1.png';
      const textAnnotations = await fetchImageLabels(imageUrl);

      const detectedAmount = findAmount(textAnnotations);

      setAmount(detectedAmount);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Receipt Amount</h1>
      <p>{amount}</p>
    </div>
  )
}

async function fetchImageLabels(imageUrl: any) {
  const response = await fetch(`/api/analyzeImage?imageUrl=${encodeURIComponent(imageUrl)}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Error fetching image labels');
  }
}

function findAmount(textAnnotations: any) {
  // 정규식을 사용하여 금액과 관련된 문자열을 찾습니다.
  const regex = /((₩|\b원\b)?\s?(\d{1,3}(,\d{3})*))/g;
  const amounts: any[] = [];

  textAnnotations.forEach((annotation: any) => {
    const matches = annotation.description.match(regex);

    if (matches) {
      matches.forEach((match: any) => {
        const refinedMatch = getRefine(match);

        amounts.push(refinedMatch); 
      });
    }
  });

  console.log(amounts)

  // 가장 큰 금액을 반환합니다. 이것이 구매 총액일 가능성이 높습니다.
  return Math.max(...amounts);
}

const getRefine = (str: string) => {

  const cleanedString = str.replace(/^\s+|\s+$|,/g, '').replace(/\n/g, '');

  return cleanedString;
}
