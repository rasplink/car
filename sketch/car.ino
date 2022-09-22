#include <ESP8266WiFi.h>

const char *ssid = "wifiName";
const char *password = "wifiPassword";

int pin4 = D4;
int pin5 = D5;
int pin6 = D6;
int pin7 = D7;

WiFiServer server(80);

void setup()
{
  Serial.begin(9600);
  delay(10);

  // special case to wemos d1 wifi, high means off, low means on
  // make relays off | initial status
  // 4
  pinMode(pin4, OUTPUT);
  digitalWrite(pin4, HIGH);
  // 5
  pinMode(pin5, OUTPUT);
  digitalWrite(pin5, HIGH);
  // 6
  pinMode(pin6, OUTPUT);
  digitalWrite(pin6, HIGH);
  // 7
  pinMode(pin7, OUTPUT);
  digitalWrite(pin7, HIGH);

  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Start the server
  server.begin();
  Serial.println("Server started");

  // Print the IP address
  Serial.print("Use this URL : ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}

void loop()
{
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client)
  {
    return;
  }

  // Wait until the client sends some data
  Serial.println("new client");
  while (!client.available())
  {
    delay(1);
  }

  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // handle car movements
  /* 
    forward
    right
    backward
    left
    stop
    forwardRight
    forwardLeft
    backwardRight
    backwardLeft
  */ 

  // 4
  if (request.indexOf("/api/car/forward") != -1) { // forward = 4
    digitalWrite(pin4, LOW); // on
    // the rest off
    digitalWrite(pin5, HIGH);
    digitalWrite(pin6, HIGH);
    digitalWrite(pin7, HIGH);
  } else if (request.indexOf("/api/car/backward")) { // backward = 5
    digitalWrite(pin5, LOW); // on
    // the rest off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin6, HIGH);
    digitalWrite(pin7, HIGH);
  } else if (request.indexOf("/api/car/right")) { // right = 6
    digitalWrite(pin6, LOW); // on
    // the rest off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin5, HIGH);
    digitalWrite(pin7, HIGH);
  } else if (request.indexOf("/api/car/left")) { // left = 7
    digitalWrite(pin7, LOW); // on
    // the rest off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin5, HIGH);
    digitalWrite(pin6, HIGH);
  } else if (request.indexOf("/api/car/forwardRight")) {
    // on
    digitalWrite(pin4, LOW);
    digitalWrite(pin6, LOW); 
    // the rest off
    digitalWrite(pin5, HIGH);
    digitalWrite(pin7, HIGH);
  } else if (request.indexOf("/api/car/forwardLeft")) {
    // on
    digitalWrite(pin4, LOW);
    digitalWrite(pin7, LOW);
    // the rest off
    digitalWrite(pin5, HIGH);
    digitalWrite(pin6, HIGH); 
  } else if (request.indexOf("/api/car/backwardRight")) {
    // on
    digitalWrite(pin5, LOW);
    digitalWrite(pin6, LOW); 
    // the rest off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin7, HIGH);
  } else if (request.indexOf("/api/car/backwardLeft")) {
    // on
    digitalWrite(pin5, LOW);
    digitalWrite(pin7, LOW);
    // the rest off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin6, HIGH); 
  } else if (request.indexOf("/api/car/stop")) {
    // switch all relays off
    digitalWrite(pin4, HIGH);
    digitalWrite(pin5, HIGH);
    digitalWrite(pin6, HIGH);
    digitalWrite(pin7, HIGH);
  }

  // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Content-Type: application/json");
  client.println(""); // do not forget this one
  client.println("{status: ok}");

  delay(1);
  Serial.println("Client disconnected");
  Serial.println("");
}
