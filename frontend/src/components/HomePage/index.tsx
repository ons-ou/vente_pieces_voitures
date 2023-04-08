import ProductCard from "./productCard";
import "./home.css";
import { Row } from "react-bootstrap";
import CategoriesList from "./categoryList";
import "bootstrap/dist/css/bootstrap.min.css"
import SideBar from "./sideBar";
import { useParams } from "react-router-dom";
import {useState} from "react";
import {ProductProps} from "../../types/ProductProps";

export function HomePage() {
  let { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<ProductProps[]>([]);

  const handleSearch = (products : ProductProps[]) => {
    setProducts(products);
  };

  return (
    <div className="d-flex flex-row justify-items-between">
        <SideBar handleSearch={handleSearch}/>
    <div className="p-2 "
    style = {{
        width: "75%",
        marginLeft: "50px"}
    }>
      <h4>Catégories</h4>
      <CategoriesList />
      <h4 style={{paddingTop: 90}}>
        Résulats de la recherche pour :
      </h4>
      <Row style={{ gap: 30 }}>
        {products
          .map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
      </Row>
    </div>
    </div>
  );
}
