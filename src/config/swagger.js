import YAML from "yamljs";

const swaggerDocument = YAML.load("./src/config/swaggerDocs.yaml");
export default swaggerDocument;
