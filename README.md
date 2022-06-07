HBS (heart beat sensor) alerts

Table of Contents

• Introduction: a brief introduction about the problem

• Architecture: architecture of the proposed system

• Installation&run: description of installation steps

Introduction
The heart beat sensor is based on the principle of photoplethysmography. It measures the change in level of blood through any organ of the body which causes a change in the light intensity through that organ (avascular region). In the case of applications where the heart pulse rate is to be monitored, the timing of the pulses is more important. The flow of blood level is decided by the rate of heart pulses and since light is absorbed by the blood, the signal pulses are equivalent to the heartbeat pulses. This sensor will monitor the changes into the blood level and alert user when it will exceed from the normal level.

There are two types of photoplethysmography:

Transmission: Light emitted from the light-emitting device is transmitted through any vascular region of the body like earlobe or wrist and received by the detector.

Reflection: Light emitted from the light-emitting device is reflected by the regions.

Using heart beat sensor, we can study the heart's function in a simple and efficient manner. This sensor senses the blood flow through the ear lobe and wrist. The earlobe or wrist projects a noise free and better measurement of blood flow in comparison to any device that is wearable at the wrist. As the heart pumps blood in the entire body, earlobes or wrist responds to this change in blood flow that can be measured as the change in blood flow with respect to time. The sensor flashes a light source in form of an incandescent lamp on the ear or wrist nerve and monitors the light modulation. The clip if used for fingertip in between on body surface (skin contact) within the thumb and index finger. The measured signal is amplified and inverted. Filtering is done to reduce noise signal. This signal helps in measuring the heart rate, where the heart pump rate can be obtained. Heart rate, though averaged as 72 per minute, mostly varies from person to person to some extent. The ideal value of an adult heart rate is different than that of an athlete who possesses less heart beat rate. For children, the heart rate is even more that could go up to 90 per second (though may vary from case to case). A person doing heavy physical activity must have a different heart rate than a person performing normal activity or in rest. The sensor employed here is exposed to all such conditions and well aware of the different rates occur for such factors. The clip can be adjusted in case of low quality signal which can deal a good amount of success in terms of accuracy of the result.

Architecture:

HBS Alerts is a project created to demonstrate serverless computing capabilities by using a simulated heart beat sensor and functions that trigger actions and generate alerts. This project contains a simulated HBS sensor that uses a random function to generate a blood level value. The range of values various from person to person. If values are more than 180bpm (value depends on the age of the person), it means that the health of the patient is in critical status, and the system will send alerts to the doctor by using IFTTT webhooks and email services. Otherwise, an app client will receive information about heart beat or blood levels.

Architecture To send the heart beat values there is the function 'sendhealthdata' on Nuclio. This function generates random heart beat values simulating a real HBS sensor. These values are published on the queue 'iot/heartbeat_sensor' of RabbitMQ. When a message is published in the queue 'iot/heartbeat_sensor', the function 'hbVal' is triggered. This function consumes the message on the queue and takes decisions: it sends the value of the heart beat to an app client through the MQTT protocol and if the value is above the given threshold is sent an email to the doctor through IFTTT triggers. It is also available a Logger that builds a log with the date and time of all entries published on the 'iot/heartbeat_sensor' queue.



![PIC](https://user-images.githubusercontent.com/107008916/172272173-cda4cf54-7b81-414b-a2f9-f26b88795e1d.png)


Installation&Run

• Install Docker from the official website

• Install RabbitMQ by running:

docker run -p 9000:15672 -p 1883:1883 -p 5672:5672 cyrilix/rabbitmq-mqtt

• Install Nuclio by running:

docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64

• Create your IFTTT account, create a new Applet with event name mailtrigger, WebHooks in the 'if" section and 'Email' in the then section.


• Install required libraries

npm install mqtt

npm install amqplib

npm install request

• Deploy the sendhealthdata.js function on Nuclio, it will create the queue iot/bloodSugar on RabbitMQ and send a random values for blood Sugar.

Docker containers

![docker](https://user-images.githubusercontent.com/107008916/172272341-342c29f3-26ff-4ccd-a553-d6f7d9ba97ee.PNG)

Nuclio

![nuiclio](https://user-images.githubusercontent.com/107008916/172272381-d529e899-4dc0-4449-8f0f-fddb93e4d14c.PNG)

RabbitMQ

![rabbit mq](https://user-images.githubusercontent.com/107008916/172272409-b0ae4c6f-0b7d-4a12-ac35-e8be8a8a1391.PNG)

• Run the DataLogger.js function, it will start to show all the values published on the queue and their timestamp.

Display

![heart beat rating](https://user-images.githubusercontent.com/107008916/172272443-2259561a-24b7-4e82-83e9-e84bec7cd5fa.PNG)

• Run the heartbeat.js function to start to read values from the queue iot/heartbeat_sensor and basing on the value found, it will take some actions. If the value is in the safe health range (<180) it will send the value to an app client using mqtt, while if the value is above the safe health range (>180) it will also send an email to the doctor to warn about the patient's health. As application, has been used a general purpose MQTT client for android.

IFTTT

![ifttt](https://user-images.githubusercontent.com/107008916/172272599-0a0e6877-e7b3-4268-8243-67fc8fa2b0e1.PNG)

MQTIZER

![image heartbeat](https://user-images.githubusercontent.com/107008916/172272659-05dda0d7-e558-4379-82c9-7a7dce48eda2.jpeg)

Note: in the above mentioned functions you need to change the IP address with your own IP address and the API KEY of the IFTTT function with the APY KEY you will find in settings after you create your own function.




