import { useReducer } from "react";

interface IInitialState {
  invoiceDate: string;
  paymentDueDate: string;
  serviceCompletionDate: string;
  articles: {
    articleId: string;
    quantity: number;
  }[];
  buyer?: string;
  recepient?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    email: string;
    phoneNumber: string;
  };
  company?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    taxNumber: string;
  };
  issuer?: string;
}

type Action =
  | { type: "invoiceDate"; payload: string }
  | { type: "paymentDueDate"; payload: string }
  | { type: "articles"; payload: { articleId: string; quantity: number } }
  | { type: "buyer"; payload: string }
  | { type: "issuer"; payload: string }
  | {
      type: "recepient";
      payload: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        email: string;
        phoneNumber: string;
      };
    }
  | {
      type: "company";
      payload: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        taxNumber: string;
      };
    }
  | { type: "reset" };

const initialState: IInitialState = {
  invoiceDate: "",
  paymentDueDate: "",
  serviceCompletionDate: "",
  articles: [],
};

function reducer(state: IInitialState, action: Action): IInitialState {
  switch (action.type) {
    case "invoiceDate": {
      return { ...state, invoiceDate: action.payload };
    }
    case "paymentDueDate": {
      return { ...state, paymentDueDate: action.payload };
    }
    case "articles": {
      return { ...state, articles: [...state.articles, action.payload] };
    }
    case "buyer": {
      return { ...state, buyer: action.payload };
    }
    case "issuer": {
      return { ...state, issuer: action.payload };
    }
    case "recepient": {
      return { ...state, recepient: action.payload };
    }
    case "company": {
      return { ...state, company: action.payload };
    }
    case "reset": {
      return initialState;
    }
  }
}

function CreateInvoiceForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log(state, dispatch);

  return <div></div>;
}

export default CreateInvoiceForm;
