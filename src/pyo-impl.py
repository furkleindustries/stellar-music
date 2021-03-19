from pyo import *

# Creates a Server object with default arguments.
# See the manual about how to change the sampling rate, the buffer
# size, the number of channels or one of the other global settings.
s = Server(sr=48000, buffersize=2048, duplex=1, winhost="mme")

# Boots the server. This step initializes audio and midi streams.
# Audio and midi configurations (if any) must be done before that call.
s.boot()

# Drops the gain by 20dB.
s.amp = 0.1

# Creates a sine wave player.
# The out() method starts the processing
# and sends the signal to the output.
a = Sine(freq=261.6, mul=0.25).out()

# Passes the sine wave through an harmonizer.
h1 = Harmonizer(a).out()

# Then the harmonized sound through another harmonizer.
h2 = Harmonizer(h1).out()

# And again...
h3 = Harmonizer(h2).out()

# And again...
h4 = Harmonizer(h3).out()

sc = Scope([a, h1, h2, h3, h4])


# Starts the server. This step activates the server processing loop.
s.start()

# Here comes the processing chain...

# The Server object provides a Graphical User Interface with the
# gui() method. One of its purpose is to keep the program alive
# while computing samples over time. If the locals dictionary is
# given as argument, the user can continue to send commands to the
# python interpreter from the GUI.
s.gui(locals())
