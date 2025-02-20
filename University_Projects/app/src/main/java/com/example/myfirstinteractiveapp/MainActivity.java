package com.example.myfirstinteractiveapp;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        textView = findViewById(R.id.textView);

        // Triggering of network call
        new GetUserTask(textView).execute("http://www.trinity-developments.co.uk/maps");
    }

    // AsyncTask to handle network operation
    private class GetUserTask extends AsyncTask<String, Void, String> {

        private TextView textView;

        public GetUserTask(TextView textView){
            this.textView = textView;
        }
        @Override
        protected String doInBackground(String... urls) {
            String result = null;
            try {
                // Open a connection to Scotland Yard URL
                URL url = new URL(urls[0]);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET"); // Set the HTTP request method

                // Timeout
                urlConnection.setConnectTimeout(15000);
                urlConnection.setReadTimeout(15000);

                // semi-formatted Response
                BufferedReader reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                StringBuilder stringBuilder = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                }

                result = stringBuilder.toString(); // Stringifying of Response

                // Close the reader and connection
                reader.close();
                urlConnection.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }

            return result;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            // Handle the API response on the UI thread
            if (result != null) {
                textView.setText(result); // Display the response in the TextView TODO: Format response
            } else {
                textView.setText("Error: Unable to fetch data"); // Display error message if no data is pulled.
            }
        }
    }
}
