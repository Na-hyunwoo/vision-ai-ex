import { ChangeEvent, useState } from "react";

export default function Image() {
  const [amount, setAmount] = useState(0);

  const fetchData = async (image: File) => {
    const textAnnotations = await fetchImageLabels(image.name);

    const detectedAmount = findAmount(textAnnotations);

    setAmount(detectedAmount);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const image = event.target.files[0];

    fetchData(image);
  };
    

  return (
    <div>
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/gif,image/heif"
        onChange={handleInputChange}
      />
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

  // 가장 큰 금액을 반환합니다. 이것이 구매 총액일 가능성이 높습니다.
  return Math.max(...amounts);
}

// 앞 뒤의 \n, 공백을 제거하고, ,(컴마)를 제거합니다. 
const getRefine = (str: string) => {
  const cleanedString = str.replace(/^\s+|\s+$|,/g, '').replace(/\n/g, '');

  return cleanedString;
}
