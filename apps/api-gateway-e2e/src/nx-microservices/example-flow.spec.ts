import axios from 'axios';

describe('Example Flow E2E', () => {
  const gatewayUrl = `http://localhost:3000/api`;
  const exampleName = `test-example-${Date.now()}`;

  it('should create an example in service1 and retrieve it from service2', async () => {
    // Step 1: Create an example record via service1
    const createResponse = await axios.post(
      `${gatewayUrl}/services/service1/create_example`,
      { name: exampleName }
    );

    expect(createResponse.status).toBe(201);
    expect(createResponse.data.success).toBe(true);
    expect(createResponse.data.data.name).toBe(exampleName);
    const createdId = createResponse.data.data.id;

    // A small delay to ensure data is propagated if needed (usually not necessary for a single DB)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 2: Retrieve all examples from service2
    const findResponse = await axios.post(
      `${gatewayUrl}/services/service2/find_all_examples`,
      {}
    );

    expect(findResponse.status).toBe(201);
    expect(findResponse.data.success).toBe(true);
    expect(Array.isArray(findResponse.data.data)).toBe(true);

    // Step 3: Verify that the created example is in the list
    const foundExample = findResponse.data.data.find(ex => ex.id === createdId);
    expect(foundExample).toBeDefined();
    expect(foundExample.name).toBe(exampleName);
  }, 20000); // Increase timeout to 20 seconds for E2E test
});
