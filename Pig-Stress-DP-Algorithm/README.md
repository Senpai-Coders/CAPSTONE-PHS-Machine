# PHS MACHINE

Detection and Resolving Heat Stress from Pig that utilize Thermographic Imaging, Image processing, & Deep Learning

## Deep learning

To get started with deep learning. Follow the steps below

1. install Anaconda Navigator or MiniConda https://www.anaconda.com/products/distribution
2. open anaconda prompt and create an environment
   > conda create -n pig-stress-env python=3.8
3. Check if environment is created

   > conda env list

  <img src='../static/2022-04-26_19-36.png' width='450px' >

4. Activate the environment
   > conda activate pig-stress-env
5. install dependencies. The dependencies will be used throughout the project specially in deep learning

   > pip install -r Pig-Stress-DP-Algorithm/requirements.txt

6. Visit the `Pig-Stress-DP-Algorithm/main.ipynb` file for more information.

Optional in environemnts

- Testing the environemnt if working
  > python Pig-Stress-DP-Algorithm/test-env.py
- Deactivating environment
  > conda deactivate
- Deleting the environment. Make sure to deactivate the env first.
  > conda env remove --name pig-stress-env


## For RPI
https://github.com/PINTO0309/Tensorflow-bin/#usage:
https://github.com/PINTO0309/Tensorflow-bin
https://github.com/PINTO0309/Tensorflow-bin/tree/main/previous_versions

1. Install Python Version 3.8

2. Create Environment 
```
py python3 -m venv .pig-stress-env 
```

3. Activate Environment
```
source .pig-stress-env/bin/activate
```

4. Install Dependencies
```
pip3 install -r Pig-Stress-DP-Algorithm/requirements.txt
```

5. Test if everything is working
```
python3 test-env.py
```