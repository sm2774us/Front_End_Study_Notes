import React, { useState, useEffect } from "react";
// import { connect } from 'react-redux'

interface ColonistListProps {
  page: number;
}

type Colonist = {
  name: string;
};

type ColonistCollection = Colonist[];

interface ColonistResult {
  colonists: ColonistCollection;
}

const ColonistList: React.FunctionComponent<ColonistListProps> = ({ page }) => {
  const [colonistsResult, setColonists] = useState<ColonistResult>({
    colonists: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [issuesError, setIssuesError] = useState<Error | null>(null);

  const getData = async () => {

    setIsLoading(true);

    const desiredUrl = `http://localhost:8080/demo/all`;

    try {
      const response = await fetch(desiredUrl);
      if(!response) {
        setIsLoading(false);
        return setIssuesError(new Error("something went wrong"));
      }
    } catch(e) {
      setIsLoading(false);
       return setIssuesError(new Error("something went wrong"));
    }

    const response = await fetch(desiredUrl);
    const json = await response.json();
    const colonists = await json; 

    setIsLoading(false);
    return setColonists({ colonists });
  };

  useEffect(() => {
    if (!isLoading) {
      //getData();
      //setIsLoading(true);
    }
    getData();
  }, [page]);

  //if (!isLoading) getData();
  //setIsLoading(true);
  //getData();

  const { colonists } = colonistsResult;
  const list = colonists.map(({ name }: Colonist, idx: number) => {
    return <li key={idx}>{name}</li>;
  });

  return (
    <div>
      {isLoading && <p>loading...</p>}
      <ul>{list}</ul>
      {issuesError && <p>{issuesError.message}</p>}
    </div>
  );
};

export default ColonistList;
